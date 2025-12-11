const API_URL = "http://localhost:3000/books";
let allBooks = [];

function protect() {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "login.html";
    }
    document.getElementById("userName").innerText =
        localStorage.getItem("currentUser");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

async function loadBooks() {
    const res = await fetch(API_URL);
    allBooks = await res.json();
    updateStats();
    renderBooks();
}

//  SECTION SWITCHING (HOME / BOOKS / ADD)
function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById(id).style.display = "block";

    // Render books only when opening book page
    if (id === "books") {
        renderBooks();
    }
}

async function addBook() {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const imageInput = document.getElementById("image");

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const image = imageInput.value.trim();

    if (!title || !author) {
        alert("Please fill title and author");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            author,
            image,
            taken: false
        })
    });

    //  CLEAR INPUTS
    titleInput.value = "";
    authorInput.value = "";
    imageInput.value = "";

    //  RELOAD & SHOW BOOKS
    await loadBooks();
    showSection("books");
}


function renderBooks() {
    const list = document.getElementById("bookList");
    if (!list) return;

    const search =
        document.getElementById("searchInput")?.value.toLowerCase() || "";
    const sort = document.getElementById("sort")?.value || "az";

    let books = [...allBooks].filter(b =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
    );

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

            ${
                b.taken
                ? `<span style="color:red;"><b>TAKEN</b></span>`
                : `<button onclick="markTaken(${i})">Mark Taken</button>`
            }
        </div>
        `;
    });
}


    books.sort((a,b)=> sort==="az"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title));

    list.innerHTML = "";
    books.forEach((b,i)=>{
        list.innerHTML += `
        <div class="book-card">
            <img src="${b.image||'https://via.placeholder.com/150'}">
            <h3>${b.title}</h3>
            <p>${b.author}</p>
        </div>`;
    });
async function markTaken(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT"
    });
    loadBooks();
}

function updateStats() {
    totalCount.innerText = allBooks.length;
    availableCount.innerText = allBooks.filter(b=>!b.taken).length;
    takenCount.innerText = allBooks.filter(b=>b.taken).length;
}


