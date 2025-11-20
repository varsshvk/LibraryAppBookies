import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
function DeleteBook() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const navigate = useNavigate(); 
  // Fetch list of books
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
        alert("Failed to fetch books");
      }
    };
    fetchBooks();
  }, []);

  // Handle delete button click
  const handleDelete = async () => {
    if (!selectedBookId) {
      alert("Please select a book to delete.");
      return;
    }

    const token = localStorage.getItem("jwt");
    const res = await fetch(`http://localhost:8080/api/books/${selectedBookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Book deleted successfully!");
      // Refresh book list after deletion
      setBooks(books.filter(book => book.bid !== selectedBookId));
      setSelectedBookId("");
    } else {
      alert("Failed to delete book");
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Book</h2>
      <select
        value={selectedBookId}
        onChange={(e) => setSelectedBookId(e.target.value)}
      >
        <option value="">Select a book</option>
        {books.map(book => (
          <option key={book.bid} value={book.bid}>
            {book.title}
          </option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete Book</button>
      <button type="button" onClick={() => navigate('/admindashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default DeleteBook;
