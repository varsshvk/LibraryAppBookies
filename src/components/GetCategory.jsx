import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch categories with optional search query
  const fetchCategories = async (name = '') => {
    const token = localStorage.getItem('jwt');
    const url = `http://localhost:8080/api/categories/search${name ? `?name=${encodeURIComponent(name)}` : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    } else {
      alert('Failed to fetch categories');
    }
  };

  // Effect runs on first mount and when searchTerm changes
  useEffect(() => {
    fetchCategories(searchTerm);
  }, [searchTerm]);

  // Decode user role from JWT token
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

  // Navigate back to correct dashboard
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
      <h2>All Categories</h2>
      <input
        type="text"
        placeholder="Search categories by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ display: 'block', margin: '10px auto', padding: '8px 12px', width: '80%', fontSize: '16px' }}
      />
      <table style={{ borderCollapse: 'collapse', width: '80%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.cid} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{cat.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{cat.description}</td>
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

export default CategoryList;
