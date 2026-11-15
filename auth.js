
auth.onAuthStateChanged(function (user) {
    if (!user) {
        window.location.replace("login.html");
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
