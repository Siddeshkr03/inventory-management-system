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

  interface RecentItem {
    id: number;
    itemName: string;
    categoryName: string;
    supplierName: string;
    createdAt: string;
  }

  interface RecentActivity {
    id: number;
    module: string;
    action: string;
    description: string;
    performedBy: string;
    performedAt: string;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalItems: 0,
    totalSuppliers: 0,
    inStock: 0,
    lowStock: 0,
    preOrder: 0,
    outOfStock: 0,
  });

  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData();
    getCategorySummary();
    getRecentlyAddedItems();
    getRecentActivities();
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

  const getRecentlyAddedItems = async () => {
    try {
      const response = await api.get("/dashboard/recent-items");

      setRecentItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRecentActivities = async () => {
    try {
      const response = await api.get("/dashboard/recent-activities");

      setRecentActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRelativeDate = (dateString: string) => {
    const today = new Date();
    const addedDate = new Date(dateString);

    const diffTime = today.getTime() - addedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    }

    if (diffDays === 1) {
      return "Yesterday";
    }

    return `${diffDays} days ago`;
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

      <div className="recent-items-card">
        <h3>Recently Added Items</h3>

        <table className="recent-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Added</th>
            </tr>
          </thead>

          <tbody>
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <tr key={item.id}>
                  <td
                    className="recent-item-name"
                    onClick={() => navigate("/items")}
                  >
                    {item.itemName}
                  </td>
                  <td>{item.categoryName}</td>
                  <td>{item.supplierName}</td>
                  <td title={new Date(item.createdAt).toLocaleString()}>
                    <span className="recent-date-badge">
                      {getRelativeDate(item.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No recently added items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="recent-activities-card">
        <h3>Recent Activities</h3>

        <table className="recent-activities-table">
          <table className="recent-activities-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Module</th>
                <th>Action</th>
                <th>Performed By</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.description}</td>
                    <td>{activity.module}</td>
                    <td>{activity.action}</td>
                    <td>{activity.performedBy}</td>
                    <td>{getRelativeDate(activity.performedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No recent activities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
