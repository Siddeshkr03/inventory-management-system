import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar(){
    return(
        <nav className="navbar">
            <h2 className="logo">
                Inventory Management
            </h2>

            <div className="nav-links">
                <NavLink to="/">
                Dashboard</NavLink>

                <NavLink to="/items">Items</NavLink>

                <NavLink to="/suppliers">Suppliers</NavLink>
            </div>
        </nav>
        
    )
}

export default Navbar;