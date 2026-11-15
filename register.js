
const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async function (event) {
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

    message.textContent = "Creating account...";

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(
            email,
            password
        );

        await userCredential.user.updateProfile({
            displayName: name
        });

        message.textContent = "Account created! Redirecting to login...";

        await auth.signOut();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            message.textContent = "This email is already registered.";
        } else if (error.code === "auth/invalid-email") {
            message.textContent = "Please enter a valid email.";
        } else if (error.code === "auth/weak-password") {
            message.textContent = "Password is too weak.";
        } else {
            message.textContent = "Registration failed. Please try again.";
            console.error(error);
        }
    }
});
