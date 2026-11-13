const currentUser = localStorage.getItem("healthCurrentUser");

if (!currentUser) {
    window.location.replace("login.html");
}