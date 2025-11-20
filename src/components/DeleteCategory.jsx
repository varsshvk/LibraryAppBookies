import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('jwt');
      const res = await fetch('http://localhost:8080/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        alert('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (cid) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    const token = localStorage.getItem('jwt');
    const res = await fetch(`http://localhost:8080/api/categories/${cid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert('Category deleted successfully!');
      setCategories(categories.filter(cat => cat.cid !== cid)); // Refresh list after delete
    } else {
      alert('Failed to delete category');
    }
  };

  return (
    <div>
      <h2>Delete Category</h2>
      <table style={{ borderCollapse: 'collapse', width: '80%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.cid} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{cat.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{cat.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <button
                  style={{
                    backgroundColor: '#E53E3E',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                  onClick={() => handleDelete(cat.cid)}
                >
                  Delete
                </button>
              </td>
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

export default DeleteCategory;
