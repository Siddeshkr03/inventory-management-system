import "./Dashboard.css";
import Navbar from "./Navbar";
import InventoryStatusChart from "./dashboard/InventoryStatusChart";
import ItemsByCategoryChart from "./dashboard/ItemsByCategoryChart";
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

  interface CategorySummary {
    category: string;
    count: number;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalItems: 0,
    totalSuppliers: 0,
    inStock: 0,
    lowStock: 0,
    preOrder: 0,
    outOfStock: 0,
  });

  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData();
    getCategorySummary();
  }, []);

  const getDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");

      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategorySummary = async () => {
    try {
      const response = await api.get("/dashboard/category-summary");

      setCategorySummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-card" onClick={() => navigate("/items")}>
          <h3>📦 Total Items</h3>
          <h1>{dashboardData.totalItems}</h1>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/suppliers")}>
          <h3>🏢 Total Suppliers</h3>
          <h1>{dashboardData.totalSuppliers}</h1>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/items?productAvailability=IN_STOCK")}
        >
          <h3>✅ In Stock</h3>
          <h1>{dashboardData.inStock}</h1>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/items?productAvailability=LOW_STOCK")}
        >
          <h3>⚠️ Low Stock</h3>
          <h1>{dashboardData.lowStock}</h1>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/items?productAvailability=PRE_ORDER")}
        >
          <h3>📋 Pre-order</h3>
          <h1>{dashboardData.preOrder}</h1>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/items?productAvailability=OUT_OF_STOCK")}
        >
          <h3>❌ Out of Stock</h3>
          <h1>{dashboardData.outOfStock}</h1>
        </div>
      </div>

      <div className="dashboard-chart-section">
        <div className="dashboard-chart-card">
          <h3>Inventory Status</h3>

          <InventoryStatusChart
            inStock={dashboardData.inStock}
            lowStock={dashboardData.lowStock}
            outOfStock={dashboardData.outOfStock}
            preOrder={dashboardData.preOrder}
            totalItems={dashboardData.totalItems}
          />
        </div>

        <div className="dashboard-chart-card">
          <h3>Items by Category</h3>

          <ItemsByCategoryChart data={categorySummary} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
