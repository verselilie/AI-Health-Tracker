
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
        .getElementById("login-email")
        .value.trim()
        .toLowerCase();

    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    const users = JSON.parse(
        localStorage.getItem("healthUsers") || "[]"
    );

    const user = users.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        message.textContent = "Email or password is incorrect.";
        return;
    }

    localStorage.setItem(
        "healthCurrentUser",
        JSON.stringify({
            name: user.name,
            email: user.email
        })
    );

    message.textContent = "Login successful!";

    window.location.href = "index.html";
});
