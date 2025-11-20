import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [message, setMessage] = useState('');
  const [booksOpen, setBooksOpen] = useState(true);
  const [catsOpen, setCatsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [adminProfile, setAdminProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  //  Fetch welcome message
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      alert('Session expired. Please log in again.');
      navigate('/');
      return;
    }

    fetch('http://localhost:8080/api/admin', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.text())
      .then(setMessage)
      .catch(() => setMessage('Unauthorized'));
  }, [navigate]);

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // Fetch profile info
  const handleProfileClick = async () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwt');

    if (!token || !username) {
      alert('Session expired. Please log in again.');
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/auth/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setAdminProfile(data);
      setShowDropdown(!showDropdown);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      alert('Error fetching admin profile.');
    }
  };

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //  Content rendering
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="page-section">
            <header className="section-header">
              <h1>Welcome to the Library Management System</h1>
              <p>Empowering knowledge through technology and simplicity.</p>
            </header>
            <div className="section-content">
              <div className="section-text">
                <h2>Our Purpose</h2>
                <p>
                  This library management platform streamlines every aspect of
                  library operations — from cataloging to book borrowing, all in
                  one unified system. Built with an intuitive interface and
                  robust backend, it empowers both administrators and users for
                  a seamless reading experience.
                </p>
                <p>
                  Our goal is to make knowledge management efficient, accessible,
                  and digital — ensuring that libraries continue to inspire learning
                  in every form.
                </p>
              </div>
              <div className="section-image">
                <img src="/assets/homeimg.avif" alt="Library Home" />
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="page-section">
            <header className="section-header">
              <h1>About Us</h1>
              <p>Where knowledge meets innovation and history inspires progress.</p>
            </header>
            <div className="section-content reverse">
              <div className="section-image">
                <img src="/assets/about.jpg" alt="About Library" />
              </div>
              <div className="section-text">
                <h2>History & Vision</h2>
                <p>
                  Established in 1959, our library stands as a beacon of learning and
                  research excellence. Over the years, we've evolved into a modern
                  digital repository offering vast online and physical collections
                  for students and researchers alike.
                </p>
                <p>
                  Our mission is to enrich academic growth and creativity by providing
                  uninterrupted access to information, while promoting a culture of
                  curiosity and knowledge-sharing.
                </p>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="page-section">
            <header className="section-header">
              <h1>Our Services</h1>
              <p>Smart tools to simplify and enhance your library experience.</p>
            </header>
            <div className="section-content">
              <div className="section-text">
                <h2>What We Offer</h2>
                <ul>
                  <li>Book lending and return management with automated tracking.</li>
                  <li>Online reservation and availability check.</li>
                  <li>Digital cataloging and categorization of resources.</li>
                  <li>Overdue fine calculation and real-time reporting.</li>
                  <li>User and admin dashboards with role-based access.</li>
                  <li>Email notifications for due dates and reminders.</li>
                </ul>
              </div>
              <div className="section-image">
                <img src="/assets/serviceimg.webp" alt="Library Services" />
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="page-section">
            <header className="section-header">
              <h1>Contact Us</h1>
              <p>We’d love to hear from you!</p>
            </header>
            <div className="contact-section">
              <p><b>Address:</b> Knowledge Avenue, City Center</p>
              <p><b>Email:</b> admin@library.example</p>
              <p><b> Phone:</b> +91 98765 43210</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="adm-root">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="brand">
           <img src="/assets/bookiesicon.png" alt="Bookies logo" className="brand-logo" />
          <div className="brand-main">Library Admin</div>
          <div className="brand-sub"><b>BOOKIES</b></div>
        </div>

        <nav className="side-nav">
          <div className="nav-group">
            <button className="nav-toggle" onClick={() => setBooksOpen(!booksOpen)}>
              Manage Books <span className="chev">{booksOpen ? '▾' : '▸'}</span>
            </button>
            {booksOpen && (
              <div className="nav-list">
                <button onClick={() => navigate('/GetBook')}>Show Books</button>
                <button onClick={() => navigate('/admin/AddBook')}>Add Book</button>
                <button onClick={() => navigate('/admin/UpdateBook')}>Update Book</button>
                <button onClick={() => navigate('/admin/DeleteBook')}>Delete Book</button>
              </div>
            )}
          </div>

          <div className="nav-group">
            <button className="nav-toggle" onClick={() => setCatsOpen(!catsOpen)}>
              Manage Categories <span className="chev">{catsOpen ? '▾' : '▸'}</span>
            </button>
            {catsOpen && (
              <div className="nav-list">
                <button onClick={() => navigate('/GetCategory')}>Show Categories</button>
                <button onClick={() => navigate('/admin/AddCategory')}>Add Category</button>
                <button onClick={() => navigate('/admin/DeleteCategory')}>Delete Category</button>
              </div>
            )}
          </div>

          <div className="nav-group small">
            <button onClick={() => navigate('/admin/GetReservations')}>Show Reservations</button>
            <button onClick={() => navigate('/admin/GetBorrowedBooks')}>Show BorrowedBooks</button>
            <button onClick={()=>navigate('/BorrowBooks')}>Manage borrows</button>
            <button onClick={() => navigate("/profile")}> View Profile</button>

          </div>
        </nav>

        <div className="sidebar-foot">
          <div className="admin-msg">{message}</div>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="adm-main">
        <header className="top-tabs">
          <div className="tab-left">
            <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
            <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Us</button>
            <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
            <button className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
          </div>

          {/* Profile icon + dropdown */}
          <div className="tab-right" ref={dropdownRef}>
            <div className="profile-section" onClick={handleProfileClick}>
              <img src="/assets/profileicon.png" alt="Admin Profile" className="profile-pic" />
            </div>

            {showDropdown && adminProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <img src="/assets/profileicon.png" alt="avatar" className="dropdown-avatar" />
                  <div>
                    <p className="dropdown-name">{adminProfile.name}</p>
                    <p className="dropdown-email">{adminProfile.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <p><b>Role:</b> {adminProfile.role}</p>
                <p><b>Address:</b> {adminProfile.address}</p>
                <p><b>Contact:</b> {adminProfile.contactNumber}</p>
                <button className="dropdown-logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
