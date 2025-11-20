import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import "./ReserveBooks.css";

const ReserveBooks = () => {
  const [books, setBooks] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
   const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const decoded = token ? jwtDecode(token) : null;
  const username = decoded?.sub;

  //  Fetch available books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch user reservations
  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/user/name/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMyReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Reserve a book
  const reserveBook = async (bookId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/reservations/reserve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId }),
        }
      );

      if (response.ok) {
        setMessage("🎉 Book reserved successfully!");
        fetchReservations(); // refresh list
      } else {
        const error = await response.text();
        setMessage("Reservation failed: " + error);
      }
    } catch (error) {
      console.error("Error reserving book:", error);
      setMessage("Something went wrong while reserving the book.");
    }
  };

  // 🗑 Delete reservation
  const deleteReservation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMyReservations(myReservations.filter((res) => res.id !== id));
        setMessage("🗑 Reservation deleted successfully!");
      } else {
        setMessage("Failed to delete reservation");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setMessage("Something went wrong while deleting reservation.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchReservations();
  }, []);

  if (loading) return <p>Loading books...</p>;

   const handleBack = () => {
    navigate('/userdashboard');
  };
  return (
    <div className="reserve-container">
      <h1> Make a Reservation</h1>
      {message && <p className="msg">{message}</p>}

      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book.bid}>
            <img
              src="/assets/bookiesicon.png"
              alt="Book"
              className="book-img"
            />
            <h3>{book.title}</h3>
            <p>
              <b>Author:</b> {book.author}
            </p>
            
            <p>
              <b>Status:</b>{" "}
              {book.availability === "AVAILABLE" ? (
                <span className="available">Available</span>
              ) : (
                <span className="borrowed">Borrowed</span>
              )}
            </p>
            <button
              disabled={book.availability !== "BORROWED"}
              onClick={() => reserveBook(book.bid)}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>

      <div className="my-reservations">
        <h2> My Reservations</h2>
        {myReservations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Reserved Date</th>
                <th>Status</th>
                <th>Action</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {myReservations.map((res) => (
                <tr key={res.id} className="fade-row">
                  <td>{res.bookTitle}</td>
                  <td>{res.reservationDate}</td>
                  <td>{res.status}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteReservation(res.id)}
                    >
                       Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no reservations yet.</p>

        )}
        <button
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '12px 30px',
          backgroundColor: '#4B3DFE',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '18px',
          cursor: 'pointer',
          width: '200px',
        }}
        onClick={handleBack}
      >
        Back to Dashboard
      </button>
      </div>
    </div>
  );
};

export default ReserveBooks;
