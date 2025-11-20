import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './BorrowBooks.css'; //  Create this CSS file below

function BorrowBooks() {
  const [books, setBooks] = useState([]);
  const [borrowedRecords, setBorrowedRecords] = useState([]);
  const [popupMessage, setPopupMessage] = useState(''); // New popup message state
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      alert('No JWT token found, please log in.');
      return;
    }

    fetch('http://localhost:8080/api/books', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching books: ${res.status}`);
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => console.error('Error fetching books:', err));

    fetch('http://localhost:8080/api/borrowed-books/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching borrowed books: ${res.status}`);
        return res.json();
      })
      .then((data) => setBorrowedRecords(data))
      .catch((err) => console.error('Error fetching borrowed books:', err));
  }, [token]);

  //  Borrow Book with popup message
  const borrowBook = async (bid) => {
    try {
      const payload = { bookId: bid };
      const res = await fetch('http://localhost:8080/api/borrowed-books/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to borrow book');
      const borrowedBookDTO = await res.json();

      setBorrowedRecords((prev) => [...prev, borrowedBookDTO]);
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.bid === bid ? { ...b, availability: 'BORROWED' } : b))
      );

      //  Show popup message
      showPopup('Yah!! Book borrowed successfully!');
    } catch (error) {
      console.error('Error at borrowBook:', error);
      showPopup('Sorry!...Could not borrow book.');
    }
  };

  //  Popup handler
  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 3000); // disappears after 3 sec
  };

  const returnBook = async (borrowedId, bid) => {
    try {
      const borrowedRecord = borrowedRecords.find((br) => br.id === borrowedId);
      if (!borrowedRecord) {
        alert('You are not allowed to return others Books!');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const decoded = jwtDecode(token);

      const payload = {
        id: borrowedId,
        user: { id: decoded.id || decoded.userId || decoded.sub },
        book: { bid: bid },
        returnDate: today,
        fineAmount: 0,
        borrowedDate: borrowedRecord.borrowDate || today,
      };

      const res = await fetch('http://localhost:8080/api/borrowed-books/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to return book');
      await res.json();

      setBorrowedRecords((prev) => prev.filter((br) => br.id !== borrowedId));
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.bid === bid ? { ...b, availability: 'AVAILABLE' } : b))
      );

      showPopup('ThankYou..Book returned successfully!');
    } catch (error) {
      console.error('Error at returnBook:', error);
      showPopup('Oops! Could not return book.');
    }
  };

  const getUserRole = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.roles ? decoded.roles[0] : decoded.authorities ? decoded.authorities[0] : null;
    } catch {
      return null;
    }
  };

  const handleBackToDashboard = () => {
    const role = getUserRole();
    if (role === 'ROLE_ADMIN') navigate('/admindashboard');
    else if (role === 'ROLE_USER') navigate('/userdashboard');
    else navigate('/');
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Borrow Books</h2>

      {/*  Success popup */}
      {popupMessage && <div className="popup-toast">{popupMessage}</div>}

      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const bid = book.bid;
            const borrowedRecord = borrowedRecords.find(
              (br) => br.bookId === bid || br.book_id === bid || br.book?.bid === bid
            );

            const isBorrowed = book.availability === 'BORROWED';

            return (
              <tr key={bid}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td
                  style={{
                    color: book.availability === 'AVAILABLE' ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {book.availability}
                </td>
                <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => borrowBook(bid)}
                    disabled={isBorrowed}
                    style={{
                      background: isBorrowed ? '#ccc' : '#4B3DFE',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '6px 16px',
                      border: 'none',
                      cursor: isBorrowed ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => returnBook(borrowedRecord?.id, bid)}
                    disabled={!isBorrowed}
                    style={{
                      background: !isBorrowed ? '#ccc' : '#FF4B4B',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '6px 16px',
                      border: 'none',
                      cursor: !isBorrowed ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Return
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default BorrowBooks;
