import React, { useState, useEffect } from "react";
import "./AddBook.css";
import { useNavigate } from 'react-router-dom';

function AddBook() {
     const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    publishedDate: "",
    edition: "",
    genre: "",
    description: "",
    language: "",
    numberOfPages: "",
    cost: "",
    categoryId: "", 
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories to populate dropdown
    const fetchCategories = async () => {
      const token = localStorage.getItem("jwt");
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        alert("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload to send
    const payload = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      edition: book.edition,
      genre: book.genre,
      description: book.description,
      language: book.language,
      numberOfPages: parseInt(book.numberOfPages),
      cost: parseFloat(book.cost),
      category: { cid: book.categoryId }, 
    };

    const token = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8080/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Book added successfully!");
      setBook({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        publishedDate: "",
        edition: "",
        genre: "",
        description: "",
        language: "",
        numberOfPages: "",
        cost: "",
        categoryId: "",
      });
    } else {
      alert("Failed to add book.PublishDate can't be future.");
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit}>
      <h2>Add New Book</h2>
      <input
        name="title"
        value={book.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        name="author"
        value={book.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <input
        name="isbn"
        value={book.isbn}
        onChange={handleChange}
        placeholder="ISBN"
        required
      />
      <input
        name="publisher"
        value={book.publisher}
        onChange={handleChange}
        placeholder="Publisher"
      />
      <input
        name="publishedDate"
        type="date"
        value={book.publishedDate}
        onChange={handleChange}
        placeholder="Published Date"
      />
      <input
        name="edition"
        value={book.edition}
        onChange={handleChange}
        placeholder="Edition"
        required
      />
      <input
        name="genre"
        value={book.genre}
        onChange={handleChange}
        placeholder="Genre"
      />
      <textarea
        name="description"
        value={book.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        name="language"
        value={book.language}
        onChange={handleChange}
        placeholder="Language"
      />
      <input
        name="numberOfPages"
        type="number"
        value={book.numberOfPages}
        onChange={handleChange}
        placeholder="Number of Pages"
      />
      <input
        name="cost"
        type="number"
        step="0.01"
        value={book.cost}
        onChange={handleChange}
        placeholder="Cost"
      />
      <select
        name="categoryId"
        value={book.categoryId}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.cid} value={cat.cid}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Book</button>
    </form>
      <button type="button" onClick={() => navigate('/admindashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AddBook;
