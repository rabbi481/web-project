const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "books.json";

// Load books
const loadBooks = () => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
};

// Save books
const saveBooks = (books) => {
  fs.writeFileSync(FILE, JSON.stringify(books, null, 2));
};

// Get all books
app.get("/books", (req, res) => {
  res.json(loadBooks());
});

// Add book
app.post("/books", (req, res) => {
  const books = loadBooks();
  books.push(req.body);
  saveBooks(books);
  res.json({ message: "Book added" });
});

// Mark as taken
app.put("/books/:id", (req, res) => {
  const books = loadBooks();
  const id = parseInt(req.params.id);
  books[id].taken = true;
  saveBooks(books);
  res.json({ message: "Book marked as taken" });
});

// Delete book
app.delete("/books/:id", (req, res) => {
  const books = loadBooks();
  const id = parseInt(req.params.id);
  books.splice(id, 1);
  saveBooks(books);
  res.json({ message: "Book deleted" });
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
