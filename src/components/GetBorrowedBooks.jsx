import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const token = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/api/borrowed-books/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBorrowedBooks(data);
      } else {
        alert('Failed to fetch borrowed books');
      }
    };
    fetchBorrowedBooks();
  }, []);

  return (
    <div>
      <h2>Borrowed Books List</h2>
      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Book ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>User ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Borrow Date</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Return Date</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Fine Amount</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((borrowedBook) => (
            <tr key={borrowedBook.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{borrowedBook.bookId}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{borrowedBook.userId}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{borrowedBook.borrowDate}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{borrowedBook.returnDate}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{borrowedBook.fineAmount}</td>
            </tr>
          ))}
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
        onClick={() => navigate('/admindashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default GetBorrowedBooks;
