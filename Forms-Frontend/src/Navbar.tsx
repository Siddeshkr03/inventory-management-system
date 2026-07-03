import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        Inventory Management
      </h2>

      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/items">Items</NavLink>

        <NavLink to="/suppliers">Suppliers</NavLink>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;