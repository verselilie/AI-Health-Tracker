
auth.onAuthStateChanged(function (user) {
    if (!user) {
        window.location.replace("login.html");
        return;
    }

    const nameElement = document.getElementById("user-name");

    if (nameElement) {
        const userName = user.displayName || user.email.split("@")[0];
        nameElement.textContent = `Hello, ${userName}! 💚`;
    }
});

async function logoutUser() {
    try {
        await auth.signOut();
        window.location.replace("login.html");
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Unable to log out. Please try again.");
    }
}
