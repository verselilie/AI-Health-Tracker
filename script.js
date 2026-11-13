function selectMood(button) {

    const buttons = document.querySelectorAll(".mood-button");

    buttons.forEach(function(item) {
        item.classList.remove("selected");
    });

    button.classList.add("selected");
}
function selectEnergy(button) {

    const buttons = document.querySelectorAll(".energy-button");

    buttons.forEach(function(item) {
        item.classList.remove("selected");
    });

    button.classList.add("selected");
}
function submitCheckin() {

    const sleep = document.getElementById("sleep").value;
    const water = document.getElementById("water").value;
    const symptoms = document.getElementById("symptoms").value;

    const moodButton = document.querySelector(".mood-button.selected");
    const mood = moodButton ? moodButton.textContent.trim() : "Not selected";

    const energyButton = document.querySelector(".energy-button.selected");
    const energy = energyButton ? energyButton.textContent.trim() : "Not selected";

    if (!moodButton) {
    alert("Please select your mood first 😊");
    return;
}

if (!energyButton) {
    alert("Please select your energy level ⚡");
    return;
}
 const healthData = {
    mood: mood,
    sleep: sleep,
    water: water,
    energy: energy,
    symptoms: symptoms
};
localStorage.setItem("healthData", JSON.stringify(healthData));
let history = JSON.parse(localStorage.getItem("healthHistory")) || [];

history.push({
    ...healthData,
    date: new Date().toLocaleString()
});

localStorage.setItem("healthHistory", JSON.stringify(history));
localStorage.setItem("aiLoading", "true");
window.location.href = "dashboard.html";
    alert(
        "Your check-in has been recorded! 😊\n\n" +
        "Mood: " + mood + "\n" +
        "Sleep: " + sleep + " hours\n" +
        "Water: " + water + " glasses\n" +
        "Energy: " + energy + "\n" +
        "Symptoms: " + symptoms
    );
}
function loadDashboard() {

    const savedData = localStorage.getItem("healthData");

    if (!savedData) {
        return;
    }

    const healthData = JSON.parse(savedData);
    const insightElement = document.getElementById("ai-insight");

    document.getElementById("dashboard-mood").textContent = healthData.mood;
    document.getElementById("dashboard-sleep").textContent = healthData.sleep + " hours";
    document.getElementById("dashboard-water").textContent = healthData.water + " glasses";
    document.getElementById("dashboard-energy").textContent = healthData.energy;
    document.getElementById("dashboard-symptoms").textContent = healthData.symptoms;
}

if (document.querySelector(".dashboard-page")) {
    loadDashboard();
}

function loadDashboard() {

    const savedData = localStorage.getItem("healthData");

    if (!savedData) {
        return;
    }

    const healthData = JSON.parse(savedData);

    document.getElementById("dashboard-mood").textContent = healthData.mood;
    document.getElementById("dashboard-sleep").textContent = healthData.sleep + " hours";
    document.getElementById("dashboard-water").textContent = healthData.water + " glasses";
    document.getElementById("dashboard-energy").textContent = healthData.energy;
    document.getElementById("dashboard-symptoms").textContent = healthData.symptoms;


    // AI HEALTH INSIGHT

    let insights = [];
    
const lowSleepAndEnergy =
    Number(healthData.sleep) < 6 &&
    healthData.energy === "Low";

    if (healthData.mood.includes("😔")) {
    insights.push(
        "💚 Your mood seems a little low today. Take some time for yourself and do something that helps you feel comfortable."
    );
}

if (healthData.mood.includes("😡")) {
    insights.push(
        "🌿 It seems like you're feeling frustrated today. Taking a short break and giving yourself some quiet time may help."
    );
}

if (healthData.mood.includes("😊")) {
    insights.push(
        "✨ Your mood looks positive today! Keep doing things that support your well-being."
    );
}

    if (healthData.energy === "Low" && !lowSleepAndEnergy) {
    insights.push(
        "⚡ Your energy level is low today. Try to give yourself enough time to rest and recharge."
    );
}

    if (Number(healthData.sleep) < 6 && !lowSleepAndEnergy) {
    insights.push(
        "😴 You may need more rest. Try to maintain a regular sleep schedule."
    );
}

    if (healthData.water < 4) {
    insights.push(
        "💧 Your water intake is a little low. Remember to drink water regularly throughout the day."
    );
}

    if (healthData.symptoms && healthData.symptoms.trim() !== "") {
    insights.push(
        "🌿 You mentioned feeling some symptoms today. Pay attention to how you feel and give yourself time to rest."
    );
}

    if (insights.length === 0) {
    insights.push(
        "✨ Your daily wellness looks fairly balanced today. Keep taking care of yourself and maintaining healthy habits!"
    );
}

let summary = "";

if (healthData.energy === "Low") {
    summary = "Your energy seems a little low today.";
} else if (healthData.energy === "High") {
    summary = "You seem to have good energy today!";
} else {
    summary = "Your energy level looks fairly balanced today.";
}

if (healthData.sleep < 6) {
    summary += " Getting enough rest may help you feel better.";
} else if (healthData.sleep >= 8) {
    summary += " You seem to be getting a good amount of sleep.";
}

if (healthData.water < 4) {
    summary += " Remember to drink water regularly.";
}
    const finalInsight = insights.join(" ");

    document.getElementById("ai-insight").textContent = finalInsight;
}

function showDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("current-date").textContent =
        today.toLocaleDateString("en-US", options);
}

if (document.querySelector(".dashboard-page")) {
    loadDashboard();
    showDate();
}

function loadHealthHistory() {
    const historyContainer = document.getElementById("health-history");

    if (!historyContainer) return;

    const history = JSON.parse(
        localStorage.getItem("healthHistory")
    ) || [];

    if (history.length === 0) {
        historyContainer.innerHTML =
            "<p>No check-in history yet.</p>";
        return;
    }

    historyContainer.innerHTML = "";

    history.slice().reverse().forEach(function (entry) {
        const item = document.createElement("div");
        item.className = "history-item";

        const date = document.createElement("p");
        date.textContent = "📅 " + entry.date;

        const details = document.createElement("p");
        details.textContent =
            "Mood: " + entry.mood +
            " | Sleep: " + entry.sleep + " hours" +
            " | Water: " + entry.water + " glasses" +
            " | Energy: " + entry.energy;

        const symptoms = document.createElement("p");
        symptoms.textContent =
            "Symptoms: " + (entry.symptoms || "None");

        item.append(date, details, symptoms);
        historyContainer.appendChild(item);
    });
}

loadHealthHistory();