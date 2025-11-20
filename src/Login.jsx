import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: username, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('username', data.username);
      const payload = decodeToken(data.token);
      const roles = payload?.roles || [];

      if (roles.includes('ROLE_ADMIN')) navigate('/admindashboard');
      else if (roles.includes('ROLE_USER')) navigate('/userdashboard');
      else alert('Role not recognized');
    } else {
      alert('Login failed: ' + (data.message || 'Invalid credentials'));
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* LEFT SIDE - LOGIN FORM */}
        <div className="auth-form-section">
          <div className="tab-header">
            <Link to="/login" className="active-tab">Log In</Link>
            <Link to="/register" className="inactive-tab">Sign Up</Link>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember me + Forgot Password section */}
            <div className="remember-forgot">
              <label className="remember">
                <input type="checkbox" /> Remember Me
              </label>

              {/*  New Forgot Password link */}
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn">Log In</button>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE PANEL */}
        <div className="auth-image-section">
          <img src="/assets/libraryTree.jpg" alt="BOOKIES" />
        </div>
      </div>
    </div>
  );
}

export default Login;
