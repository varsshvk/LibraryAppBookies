import React, { useState, useEffect } from "react";
import "./AddBook.css";
import { useNavigate } from 'react-router-dom';
function UpdateBook() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate(); 
  // Fetch list of books for dropdown
  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("jwt");
      const res = await fetch("http://localhost:8080/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        alert("Failed to fetch books list");
      }
    };
    fetchBooks();
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("jwt");
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
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

  // Fetch book details when book is selected
  useEffect(() => {
    if (!selectedBookId) {
      setFormData(null);
      return;
    }
    const fetchBook = async () => {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`http://localhost:8080/api/books/${selectedBookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      if (text) {
        const data = JSON.parse(text);
        setFormData({
          ...data,
          numberOfPages: data.numberOfPages || "",
          cost: data.cost || "",
          categoryId: data.category?.cid || "",
        });
      } else {
        setFormData(null);
        alert("Book not found or empty response");
      }
    };
    fetchBook();
  }, [selectedBookId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      numberOfPages: parseInt(formData.numberOfPages, 10),
      cost: parseFloat(formData.cost),
      category: { cid: formData.categoryId },
    };

    const token = localStorage.getItem("jwt");
    const res = await fetch(`http://localhost:8080/api/books/${selectedBookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Book updated successfully!");
      setFormData(null);
      setSelectedBookId("");
    } else {
      alert("Update failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Book</h2>
      <select
        value={selectedBookId}
        onChange={(e) => setSelectedBookId(e.target.value)}
        className="dropdown-select"
      >
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book.bid} value={book.bid}>
            {book.title}
          </option>
        ))}
      </select>

      {formData && (
        <form onSubmit={handleUpdate}>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
          <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" required />
          <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" required />
          <input name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher" />
          <input name="publishedDate" type="date" value={formData.publishedDate} onChange={handleChange} placeholder="Published Date" />
          <input name="edition" value={formData.edition} onChange={handleChange} placeholder="Edition" required />
          <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" />
          <input name="numberOfPages" type="number" value={formData.numberOfPages} onChange={handleChange} placeholder="Number of Pages" />
          <input name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} placeholder="Cost" />
         <select name="availability" value={formData.availability} onChange={handleChange} required>
  <option value="">Select Availability</option>
  <option value="AVAILABLE">Available</option>
  <option value="BORROWED">Borrowed</option>
  <option value="RESERVED">Reserved</option>
  <option value="LOST">Lost</option>
</select>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.cid} value={cat.cid}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit">Update Book</button>
        </form>
        
      )}
      <button type="button" onClick={() => navigate('/admindashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default UpdateBook;
