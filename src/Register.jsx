import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    address: '',
    contactNumber: '',
    gender: '',
    role: 'user'
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [strengthText, setStrengthText] = useState('Weak');

  const navigate = useNavigate();

  // 🔹 Password rules checker
  const checkPassword = (password) => {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordStrength(checks);

    // Count satisfied rules
    const score = Object.values(checks).filter(Boolean).length;
    const levels = ['Weak', 'Okay', 'Good', 'Strong', 'Very Strong'];
    setStrengthText(levels[Math.min(score - 1, levels.length - 1)]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password') checkPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password before sending to backend
    const { length, upper, lower, number, special } = passwordStrength;
    if (!(length && upper && lower && number && special)) {
      alert('Password does not meet all strength requirements.');
      return;
    }

    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const msg = await res.text();
    if (msg.includes('success')) {
      alert('Registration successful! Please login.');
      navigate('/');
    } else {
      alert('Failed to register: ' + msg);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* LEFT SIDE - FORM */}
        <div className="register-container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />

            {/*  Password Field with Strength Indicator */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <div className="password-strength">
              <div className={`strength-bar ${strengthText.toLowerCase().replace(' ', '-')}`}></div>
              <p className="strength-text">Strength: {strengthText}</p>
            </div>
            <ul className="password-requirements">
              <li className={passwordStrength.length ? 'valid' : ''}> !** At least 8 characters</li>
              <li className={passwordStrength.upper ? 'valid' : ''}> !** One uppercase letter</li>
              <li className={passwordStrength.lower ? 'valid' : ''}> !** One lowercase letter</li>
              <li className={passwordStrength.number ? 'valid' : ''}> !** One number</li>
              <li className={passwordStrength.special ? 'valid' : ''}> !** One special character</li>
            </ul>

            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <input
              name="contactNumber"
              type="text"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
          </form>
          <div>
            Already user? <Link to="/">Go to login page</Link>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="register-image">
          <img src="/assets/RegisterTree.webp" alt="Library Tree" />
        </div>
      </div>
    </div>
  );
}

export default Register;
