import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";
import { removeToken } from "./token";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");

      removeToken();
      localStorage.removeItem("user");

      await checkAuth();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo-nav">Inventory Management</h2>

      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/items">Items</NavLink>

        <NavLink to="/suppliers">Suppliers</NavLink>

        <NavLink to="/categories">Categories</NavLink>

        <div className="profile-container">
          <div
            className="profile-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="profile-icon">👤</span>

            <span>{user?.name}</span>

            <span className="arrow">▼</span>
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="profile-name">{user?.name}</div>

              <div className="profile-email">{user?.email}</div>

              <hr />

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
