import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function BookList() {
  const [books, setBooks] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterType, setFilterType] = useState('title');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();

  const fetchBooks = async (params = '') => {
    const token = localStorage.getItem('jwt');
    const url = `http://localhost:8080/api/books/search${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setBooks(data);
    } else {
      alert('Failed to fetch books');
    }
  };

  useEffect(() => {
    // If no filter value, fetch all books
    if (!filterValue) {
      fetchBooks();
      return;
    }
    // Build query param based on filter type and value
    let queryParam = '';
    if (filterType === 'title') {
      queryParam = `?title=${encodeURIComponent(filterValue)}&author=`;
    } else if (filterType === 'author') {
      queryParam = `?title=&author=${encodeURIComponent(filterValue)}`;
    } else if (filterType === 'language') {
      queryParam = `?language=${encodeURIComponent(filterValue)}`;
    } else if (filterType === 'category') {
      queryParam = `?category=${encodeURIComponent(filterValue)}`;
    }
    fetchBooks(queryParam);
  }, [filterType, filterValue]);

  const getUserRole = () => {
    const token = localStorage.getItem('jwt');
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
    if (role === 'ROLE_ADMIN') {
      navigate('/admindashboard');
    } else if (role === 'ROLE_USER') {
      navigate('/userdashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Books List</h2>
      <button onClick={() => setFiltersVisible(!filtersVisible)} style={{ marginBottom: 10 }}>
        {filtersVisible ? 'Hide Filters' : 'Show Filters'}
      </button>
      {filtersVisible && (
        <div style={{ marginBottom: 20 }}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="language">Language</option>
            <option value="category">Category</option>
           
          </select>
          <input
            type="text"
            placeholder={`Search by ${filterType}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            style={{ marginLeft: 10, padding: 5, width: 200 }}
          />
        </div>
      )}

      <table style={{ borderCollapse: 'collapse', width: '90%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Author</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>ISBN</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Publisher</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Language</th>
             <th style={{ border: '1px solid #ddd', padding: '10px' }}>Cost</th>
              <th style={{ border: '1px solid #ddd', padding: '10px' }}>No.Of.Pages</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>availability</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>category</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bid} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.author}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.isbn}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.publisher}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.language}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.cost}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.numberOfPages}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.availability}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{book.category?.name}</td>
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
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default BookList;
