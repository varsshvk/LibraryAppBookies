import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch("http://localhost:8080/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then(setMessage)
      .catch(() => setMessage("Unauthorized"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  //  Fetch profile info (like in admin)
  const handleProfileClick = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("jwt");

    if (!token || !username) {
      alert("Session expired. Please log in again.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/auth/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setUserProfile(data);
      setShowProfile(!showProfile);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      alert("Error fetching user profile.");
    }
  };

  //  Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="home-section">
            <div className="home-text">
              <h1>Welcome to Bookies </h1>
              <p>
                Welcome to <b>Bookies</b> — your smart digital library where stories come alive!...
              </p>
              <p>
                Explore a world of books, borrow your favorites, and keep learning — anytime, anywhere.
                Whether you’re a student, a reader, or a dreamer, Bookies is your reading companion that never closes its doors.
              </p>
            </div>
            <div className="home-img">
              <img src="/assets/UserHome.jpg" alt="Library" />
            </div>
          </div>
        );

      case "about":
        return (
          <div className="content fadeIn">
            <h1>About Bookies </h1>
            <p>
              Founded with the vision to bring libraries to your fingertips, Bookies is a digital platform that connects readers
              to thousands of titles — from timeless classics to modern bestsellers.
            </p>
            <p>
              We believe in making knowledge accessible to everyone. With Bookies, you can explore, borrow, reserve, and manage your reading from the comfort of your home.
            </p>
            <p>
              <b>Our mission: To make reading effortless, engaging, and endless.</b>
            </p>
          </div>
        );

      case "services":
        return (
          <div className="content fadeIn">
            <h1>What We Offer!</h1>
            <ul>
              <li>
                <b>1. Book Borrowing</b>
                <p>
                  Borrow any available book in just one click. Keep it for 10 days and return it easily through your dashboard.
                </p>
              </li>
              <li>
                <b>2. Book Reservation</b>
                <p>
                  Found a book you love but it's already borrowed? No worries! Reserve it and get notified as soon as it's available.
                </p>
              </li>
              <li>
                <b>3. Borrowed History & Fines</b>
                <p>View your borrowing history, due dates, and fines — all in one place.</p>
              </li>
              <li>
                <b>4. Profile Management</b>
                <p>Update your contact details, address, and profile picture easily.</p>
              </li>
            </ul>
            <h2>
              <p>
                Just explore to see what's more! Unlock the digital library experience where knowledge meets technology!
              </p>
            </h2>
          </div>
        );

      case "contact":
        return (
          <div className="content fadeIn">
            <h1>Contact Us </h1>
            <p>
              We'd love to hear from you! Whether it's feedback, queries, or book requests — our team is here to help.
            </p>
            <p>
              <b>Location:</b> Bookies Library HQ, Knowledge Avenue, Chennai - 600001, Tamil Nadu, India.
            </p>
            <p>
              <b>Email:</b> support@bookies.com
            </p>
            <p>
              <b>Phone:</b> +91 98765 43210
            </p>
            <p>
              <b>Working Hours:</b> Monday to Saturday — 9:00 AM to 7:00 PM | Sunday — Closed
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="user-root">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="brand">
           <img src="/assets/bookiesicon.png" alt="Bookies logo" className="brand-logo" />
          <div className="brand-main">Welcome User!</div>
          <div className="brand-sub">Bookies! Ur Library Mate</div>
        </div>
        <nav className="side-nav">
          <button onClick={() => navigate("/GetBook")}> Show All Books</button>
          <button onClick={() => navigate("/GetCategory")}> Show All Categories</button>
          <button onClick={() => navigate("/BorrowBooks")}> Borrow Books</button>
          <button onClick={() => navigate("/MyBorrows")}>See My Borrows</button>
          <button onClick={() => navigate("/ReserveBooks")}> Make Reservations</button>
          <button onClick={() => navigate("/profile")}> View My Profile</button>

        </nav>
        <div className="sidebar-foot">
          <p className="welcome-msg">{message}</p>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="user-main">
        <header className="top-tabs">
          <div className="tab-left">
            {["home", "about", "services", "contact"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Profile Icon */}
          <div className="tab-right" ref={dropdownRef}>
            <div className="profile-section" onClick={handleProfileClick}>
              <img src="/assets/profileicon.png" alt="User" className="profile-pic" />
            </div>

            {/* Profile Dropdown */}
            {showProfile && userProfile && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <img src="/assets/profileicon.png" alt="avatar" className="dropdown-avatar" />
                  <div>
                    <p className="dropdown-name">{userProfile.name}</p>
                    <p className="dropdown-email">{userProfile.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <p><b>Role:</b> {userProfile.role}</p>
                <p><b>Address:</b> {userProfile.address}</p>
                <p><b>Contact:</b> {userProfile.contactNumber}</p>
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

export default UserDashboard;
