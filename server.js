const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Load books from JSON file
const loadBooks = () => {
  if (!fs.existsSync("books.json")) {
    fs.writeFileSync("books.json", JSON.stringify([]));
  }
  const data = fs.readFileSync("books.json", "utf-8");
  return JSON.parse(data);
};

// Save books to JSON file
const saveBooks = (books) => {
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
};

// ✅ Get all books
app.get("/books", (req, res) => {
  res.json(loadBooks());
});

// ✅ Add a book
app.post("/books", (req, res) => {
  const books = loadBooks();

  const newBook = {
    title: req.body.title,
    author: req.body.author,
    image: req.body.image || "",
    taken: false
  };

  books.push(newBook);
  saveBooks(books);

  res.json({ message: "Book added successfully" });
});

// ✅ Mark book as taken
app.put("/books/:id", (req, res) => {
  const books = loadBooks();
  const id = parseInt(req.params.id);

  if (!books[id]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[id].taken = true;
  saveBooks(books);

  res.json({ message: "Book marked as taken" });
});

// ✅ DELETE book
app.delete("/books/:id", (req, res) => {
  const books = loadBooks();
  const id = parseInt(req.params.id);

  if (!books[id]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(id, 1);
  saveBooks(books);

  res.json({ message: "Book deleted successfully" });
});

// ✅ Start server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
