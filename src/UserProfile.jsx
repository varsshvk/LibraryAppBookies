import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);

  useEffect(() => {
    axios.get("http://localhost:8080/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(err => console.error("Error fetching user profile:", err));
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8080/api/user/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:8080/api/user/change-password", {
        oldPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Error changing password!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setUser({ ...user, profilePicture: reader.result });
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    // Navigate based on user role
    if (decoded.roles && decoded.roles.includes("ROLE_ADMIN")) {
      navigate("/admindashboard");
    } else {
      navigate("/userdashboard");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>My Profile</h2>

        <img 
          src={user.profilePicture || "https://via.placeholder.com/120"} 
          alt="Profile"
          style={styles.profilePic}
        />

        <input type="file" onChange={handleImageUpload} />

        {editMode ? (
          <>
            <input
              style={styles.input}
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Name"
            />
            <input
              style={styles.input}
              value={user.contactNumber || ""}
              onChange={(e) => setUser({ ...user, contactNumber: e.target.value })}
              placeholder="Phone"
            />
            <input
              style={styles.input}
              value={user.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              placeholder="Address"
            />
            <button style={styles.saveBtn} onClick={handleSave}>Save</button>
            <button style={styles.cancelBtn} onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.contactNumber}</p>
            <p><b>Address:</b> {user.address}</p>
            <button style={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}

        <div style={styles.passwordContainer}>
          <h3>Change Password</h3>
          <input
            style={styles.input}
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button style={styles.changePassBtn} onClick={handlePasswordChange}>Change Password</button>
        </div>

        <button style={styles.backBtn} onClick={handleBack}>
           Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #fff3e0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "15px",
    color: "#333",
  },
  profilePic: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
  input: {
    width: "90%",
    padding: "8px",
    margin: "8px auto",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  editBtn: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelBtn: {
    backgroundColor: "#E57373",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  passwordContainer: {
    marginTop: "20px",
  },
  changePassBtn: {
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },
  backBtn: {
    marginTop: "20px",
    backgroundColor: "#607D8B",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default UserProfile;
