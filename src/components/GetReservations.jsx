import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetReservations() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/api/reservations/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      } else {
        alert('Failed to fetch reservations');
      }
    };
    fetchReservations();
  }, []);

  return (
    <div>
      <h2>All Reservations</h2>
      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Reservation Id</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>User Id</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Book Id</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Reservation Date</th>
            {/* Add more fields as needed */}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reservation.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reservation.userId}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reservation.bookId}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reservation.reservationDate}</td>
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

export default GetReservations;
