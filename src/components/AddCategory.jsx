import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const res = await fetch('http://localhost:8080/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      alert('Category added successfully!');
      navigate('/admindashboard');
    } else {
      alert('Failed to add category.');
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input style= {{
    marginBottom:'20px',
    padding: "8px 12px",
    borderRadius: "6px",
    border: "3px solid #070202ff",
    width: "220px",
    marginRight: "10px",
    fontSize: "20px",
   
  }}
  value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" required />
      <textarea style ={ {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "3px solid #130505ff",
    width: "220px",
    marginRight: "10px",
    fontSize: "20px",} }
    value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        
      <button style={{ marginBottom: '8px'}} type="submit">Add Category</button>
      <button type="button" onClick={() => navigate('/admindashboard')}>Back to DashBoard</button>
    </form>
    </div>
  );
}

export default AddCategory;
