import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, Mail, LogOut } from "lucide-react";
import api from "./api";
import { useAuth } from "./AuthContext";
import { removeToken } from "./token";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      const storedUser = localStorage.getItem("user");

      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("userUpdated", handleStorageUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        <div className="profile-container" ref={profileRef}>
          <div
            className="profile-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.profileImage ? (
              <img
                src={`http://localhost:8080/api/files/${user.profileImage}`}
                alt="Profile"
                className="navbar-profile-image"
              />
            ) : (
              <span className="profile-icon">👤</span>
            )}

            <span>{user?.name}</span>

            <span className="arrow">▼</span>
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="profile-name">
                <NavLink to="/profile">
                  <User /> {user?.name}
                </NavLink>
              </div>

              <div className="profile-email">
                <Mail />
                {user?.email}
              </div>

              <hr />

              <button className="logout-btn" onClick={handleLogout}>
                Logout{" "}
                <span>
                  <LogOut className="logout-logo" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
