import "./Dashboard.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

function Dashboard() {
  interface DashboardData {
    totalItems: number;
    totalSuppliers: number;
    inStock: number;
    lowStock: number;
    preOrder: number;
    outOfStock: number;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalItems: 0,
    totalSuppliers: 0,
    inStock: 0,
    lowStock: 0,
    preOrder: 0,
    outOfStock: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");

      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-card" onClick={() => navigate("/items")}>
          <h3>Total Items</h3>
          <h1>{dashboardData.totalItems}</h1>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/suppliers")}>
          <h3>Total Suppliers</h3>
          <h1>{dashboardData.totalSuppliers}</h1>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/stock")}>
          <h3>In Stock</h3>
          <h1>{dashboardData.inStock}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock</h3>
          <h1>{dashboardData.lowStock}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Pre-order</h3>
          <h1>{dashboardData.preOrder}</h1>
        </div>

        <div className="dashboard-card">
          <h3>Out of Stock</h3>
          <h1>{dashboardData.outOfStock}</h1>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
