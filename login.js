
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document
        .getElementById("login-email")
        .value.trim()
        .toLowerCase();

    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    message.textContent = "Logging in...";

    try {
        await auth.signInWithEmailAndPassword(email, password);

        message.textContent = "Login successful!";

        window.location.href = "dashboard.html";

    } catch (error) {
        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
        ) {
            message.textContent = "Email or password is incorrect.";
        } else {
            message.textContent = "Login failed. Please try again.";
            console.error(error);
        }
    }
});
