
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm").value;
    const message = document.getElementById("register-message");

    if (password.length < 6) {
        message.textContent = "Password must contain at least 6 characters.";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    const users = JSON.parse(localStorage.getItem("healthUsers") || "[]");

    if (users.some(user => user.email === email)) {
        message.textContent = "This email is already registered.";
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("healthUsers", JSON.stringify(users));

    message.textContent = "Account created! Redirecting to login...";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
});
