import { NavLink, useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");

      await checkAuth();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Inventory Management</h2>

      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/items">Items</NavLink>

        <NavLink to="/suppliers">Suppliers</NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
