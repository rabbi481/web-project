/*const API_URL = "http://localhost:3000/books";
let allBooks = [];

// MEMBER LOGIN
function saveMember() {
    const name = document.getElementById("memberNameInput").value.trim();
    if (!name) return alert("Enter your name!");
    localStorage.setItem("memberName", name);
    initMember();
}

function initMember() {
    const name = localStorage.getItem("memberName");
    if (name) {
        document.getElementById("memberInfo").innerText = `👤 Logged in as: ${name}`;
        document.querySelector(".menu").style.display = "block";
        document.getElementById("loginSection").style.display = "none";
        showSection('home', document.querySelector(".menu button.active"));
    }
}

initMember();

// MENU + PAGE SWITCH
function showSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    document.querySelectorAll('.menu button').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    renderBooks();
}

// LOAD BOOKS
async function loadBooks() {
    const res = await fetch(API_URL);
    allBooks = await res.json();
    updateCounts();
    renderBooks();
}

loadBooks();

// COUNTS
function updateCounts() {
    document.getElementById("totalCount").innerText = allBooks.length;
    document.getElementById("availableCount").innerText =
        allBooks.filter(b => !b.taken).length;
    document.getElementById("takenCount").innerText =
        allBooks.filter(b => b.taken).length;
}

// ADD BOOK
async function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const image = document.getElementById("image").value.trim();

    if (!title || !author) {
        alert("Please fill all fields");
        return;
    }

    await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            author,
            image,
            taken: false
        })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("image").value = "";

    loadBooks();
    showSection('list', document.querySelector(".menu button:nth-child(2)"));
}


    // clear input fields
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    loadBooks();
    showSection('list', document.querySelector(".menu button:nth-child(2)"));


// MARK TAKEN
async function markTaken(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    loadBooks();
}

// RENDER BOOKS
function renderBooks() {
    const list = document.getElementById("bookList");
    if (!list) return;
    list.innerHTML = "";

    let books = [...allBooks];
    const search = searchInput?.value.toLowerCase() || "";
    const sortType = sort?.value || "az";

    books = books.filter(b =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
    );

    books.sort((a,b) =>
        sortType === "az" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    books.forEach((b, i) => {
    list.innerHTML += `
    <div class="book-card ${b.taken ? "taken" : ""}">
        <img src="${b.image || 'https://via.placeholder.com/150'}" class="book-img">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
        ${!b.taken ? `<button onclick="markTaken(${i})">Mark Taken</button>` : "Taken"}
    </div>`;
});

} */

const API_URL = "http://localhost:3000/books";
let allBooks = [];

// Load books
async function loadBooks() {
    const res = await fetch(API_URL);
    allBooks = await res.json();
    updateStats();
    renderBooks();
}

// Navigation
function showSection(id, btn) {
    document.querySelectorAll(".section").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";

    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderBooks();
}

// Add book
async function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const image = document.getElementById("image").value.trim();

    if (!title || !author) return alert("Fill all fields");

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, image })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("image").value = "";

    loadBooks();
    showSection("list", document.querySelectorAll("nav button")[1]);
}

// Render books (✅ SEARCH & SORT FIXED)
function renderBooks() {
    const list = document.getElementById("bookList");
    if (!list) return;

    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const sort = document.getElementById("sort")?.value || "az";

    let books = [...allBooks];

    // ✅ Search
    books = books.filter(b =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
    );

    // ✅ Sort
    books.sort((a, b) =>
        sort === "az"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
    );

    list.innerHTML = "";

    books.forEach((b, i) => {
        list.innerHTML += `
        <div class="book-card ${b.taken ? "taken" : ""}">
            <img src="${b.image || 'https://via.placeholder.com/150'}">
            <h3>${b.title}</h3>
            <p>${b.author}</p>

            ${!b.taken 
                ? `<button onclick="markTaken(${i})">Mark Taken</button>` 
                : `<span>Taken</span>`
            }
            <button class="delete" onclick="deleteBook(${i})">Delete</button>
        </div>`;
    });
}

// Mark taken
async function markTaken(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    loadBooks();
}

// Delete book
async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadBooks();
}

// Stats
function updateStats() {
    document.getElementById("totalCount").innerText = allBooks.length;
    document.getElementById("availableCount").innerText =
        allBooks.filter(b => !b.taken).length;
    document.getElementById("takenCount").innerText =
        allBooks.filter(b => b.taken).length;
}

