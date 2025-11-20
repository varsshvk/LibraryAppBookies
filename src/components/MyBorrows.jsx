import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 


function MyBorrows() {
  const [borrowedRecords, setBorrowedRecords] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      alert('No JWT token found, please log in.');
      return;
    }
    fetch('http://localhost:8080/api/borrowed-books/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error fetching borrowed books: ' + res.status);
        return res.json();
      })
      .then(data => setBorrowedRecords(data))
      .catch(err => console.error('Error:', err));
  }, [token]);

  const handleBack = () => {
    navigate('/userdashboard');
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>My Borrowed Books</h2>
      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {borrowedRecords.map(br => (
            <tr key={br.id}>
              <td>{br.book?.title}</td>
              <td>{br.book?.author}</td>
              <td>{br.book?.genre}</td>
              <td>{br.borrowDate}</td>
              <td>{br.returnDate || '-'}</td>
              <td>{br.fineAmount}</td>
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
        onClick={handleBack}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
export default MyBorrows;
