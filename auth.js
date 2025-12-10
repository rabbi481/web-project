function register() {
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    if (!username || !password) {
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Registration successful");
    window.location.href = "login.html";
}

function login() {
    const saved = JSON.parse(localStorage.getItem("user"));
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    if (!saved) return alert("Register first");

    if (username === saved.username && password === saved.password) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", username);
        window.location.href = "index.html";
    } else {
        alert("Invalid login");
    }
}
