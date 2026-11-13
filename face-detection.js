
const camera = document.getElementById("camera");
const cameraStatus = document.getElementById("camera-status");
const expressionStatus = document.getElementById("expression-status");
const expressionResult = document.getElementById("expression-result");

const startButton = document.getElementById("start-camera");
const captureButton = document.getElementById("capture-photo");
const stopButton = document.getElementById("stop-camera");

const capturedPhoto = document.getElementById("captured-photo");
const scoreText = document.getElementById("expression-score");
const scoreBar = document.getElementById("expression-bar");

const MODEL_URL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";

let cameraStream = null;
let modelsLoaded = false;
let isAnalyzing = false;

// Load AI models
async function loadModels() {
    if (modelsLoaded) return;

    expressionStatus.textContent = "Loading AI models...";

    if (typeof faceapi === "undefined") {
        throw new Error("Face API library did not load.");
    }

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    modelsLoaded = true;
    expressionStatus.textContent = "AI models ready!";
}

// Start camera
startButton.addEventListener("click", async () => {
    try {
        startButton.disabled = true;
        captureButton.disabled = true;

        cameraStatus.textContent = "Preparing camera...";
        expressionStatus.textContent = "Preparing AI models...";

        await loadModels();

        if (!cameraStream) {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            camera.srcObject = cameraStream;
            await camera.play();
        }

        cameraStatus.textContent = "Camera is on.";
        expressionStatus.textContent = "Ready to capture a photo.";
        expressionResult.textContent = "Waiting for analysis...";

        captureButton.disabled = false;

    } catch (error) {
        cameraStatus.textContent =
            "Error: " + error.name + " - " + error.message;

        expressionStatus.textContent = "Could not start camera.";

        console.error("Camera error:", error);

    } finally {
        startButton.disabled = false;
    }
});

// Capture and analyze photo
async function detectExpression() {
    if (!cameraStream || isAnalyzing) return;

    if (camera.readyState < 2 || !camera.videoWidth) {
        expressionStatus.textContent = "Camera is not ready yet.";
        return;
    }

    isAnalyzing = true;
    captureButton.disabled = true;

    try {
        expressionStatus.textContent = "Analyzing photo...";
        expressionResult.textContent = "Please wait...";

        capturedPhoto.width = camera.videoWidth;
        capturedPhoto.height = camera.videoHeight;

        const context = capturedPhoto.getContext("2d");

        context.drawImage(
            camera,
            0,
            0,
            capturedPhoto.width,
            capturedPhoto.height
        );

        const result = await faceapi
            .detectSingleFace(
                capturedPhoto,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

        if (!result) {
            expressionStatus.textContent = "Analysis completed.";
            expressionResult.textContent =
                "No face detected. Please face the camera.";

            scoreText.textContent = "0%";
            scoreBar.style.width = "0%";

            return;
        }

        const expressions = result.expressions;

        const bestExpression = Object.entries(expressions)
            .sort((a, b) => b[1] - a[1])[0];

        const labels = {
            happy: "Happy 😊",
            sad: "Sad 😢",
            angry: "Angry 😠",
            fearful: "Fearful 😨",
            disgusted: "Disgusted 😖",
            surprised: "Surprised 😮",
            neutral: "Neutral 😐"
        };

        const label =
            labels[bestExpression[0]] || bestExpression[0];

        const confidence = Math.round(bestExpression[1] * 100);

        expressionResult.textContent = label;
        scoreText.textContent = confidence + "%";
        scoreBar.style.width = confidence + "%";

        expressionStatus.textContent =
            "Photo analyzed successfully!";

    } catch (error) {
        expressionStatus.textContent = "Analysis failed.";

        expressionResult.textContent =
            "Error: " + error.message;

        console.error("Analysis error:", error);

    } finally {
        isAnalyzing = false;
        captureButton.disabled = !cameraStream;
    }
}

// Connect capture button
captureButton.addEventListener("click", detectExpression);

// Stop camera
stopButton.addEventListener("click", () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    camera.srcObject = null;

    captureButton.disabled = true;

    cameraStatus.textContent = "Camera stopped.";
    expressionStatus.textContent = "Detection stopped.";
    expressionResult.textContent = "Expression: Not detected";

    scoreText.textContent = "0%";
    scoreBar.style.width = "0%";
});
