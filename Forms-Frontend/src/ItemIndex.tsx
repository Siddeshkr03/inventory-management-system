import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import api from "./api";
import "./ItemIndex.css";

function ItemIndex() {
  interface Supplier {
    id: number;
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  interface Item {
    id: number;
    itemName: string;
    price: string;
    quantity: string;
    category: string;
    brand: string;
    purchaseDate: string;
    productCode: string;
    paymentMethod: string;
    productAvailability: string;
    supplier: Supplier;
  }

  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [productAvailability, setProductAvailability] = useState("");

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await api.get("/items", {
        params: {
          productAvailability: productAvailability || undefined,
        },
      });

      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const deleteItem = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/items/${id}`);

      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  fetchItems();
}, [productAvailability]);

  return (
    <>
      <Navbar />

      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Item Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <label htmlFor="productAvailability">Filter</label>

          <select
            id="productAvailability"
            value={productAvailability}
            onChange={(e) => setProductAvailability(e.target.value)}
          >
            <option value="">All</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="PRE_ORDER">Pre-order</option>
          </select>
        </div>

        <h4 className="h4-title">Items</h4>

        <Link
          to="/items/add"
          onClick={() => localStorage.removeItem("itemFormData")}
        >
          <button className="add-btn">Add Item</button>
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="item-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Purchase Date</th>
              <th>Product Code</th>
              <th>Availability</th>
              <th>Supplier Name</th>
              <th className="action-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items
              .filter((item) =>
                item.itemName.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>{item.purchaseDate}</td>
                  <td>{item.productCode}</td>
                  <td>{item.productAvailability}</td>
                  <td>{item.supplier?.supplierName}</td>

                  <td className="action-column">
                    <div className="action-buttons">
                      <span
                        className="view-btn"
                        role="button"
                        onClick={() => navigate(`/items/view/${item.id}`)}
                      >
                        👁️
                      </span>

                      <span
                        className="edit"
                        role="button"
                        onClick={() => navigate(`/items/edit/${item.id}`)}
                      >
                        ✏️
                      </span>

                      <span
                        className="delete"
                        role="button"
                        onClick={() => deleteItem(item.id)}
                      >
                        🗑️
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ItemIndex;
