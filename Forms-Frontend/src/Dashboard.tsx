import "./Dashboard.css";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <><Navbar />
    <div className="dashboard">
      <div className="dashboard-card">
        <h3>Total Items</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>Total Suppliers</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>In Stock</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>Low Stock</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>Pre-order</h3>
        <h1>0</h1>
      </div>

      <div className="dashboard-card">
        <h3>Out of Stock</h3>
        <h1>0</h1>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
