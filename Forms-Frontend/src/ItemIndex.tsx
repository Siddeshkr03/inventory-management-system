import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
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

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/items");
      const data = await response.json();

      console.log(data);

      setItems(data);
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
      await fetch(`http://localhost:8080/api/items/${id}`, {
        method: "DELETE",
      });

      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
              <th>ID</th>
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
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
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
