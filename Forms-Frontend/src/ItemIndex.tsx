import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ItemIndex.css";

function ItemIndex() {
  interface Item {
    id: number;
    itemName: string;
    price: string;
    quantity: string;
    category: string;
    brand: string;
    supplier: string;
    purchaseDate: string;
    productCode: string;
    paymentMethod: string;
    productAvailability: string;
  }

  const [items, setItems] = useState<Item[]>([]);

  const [search, setSearch] = useState("");

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

    if (!confirmDelete) {
      return;
    }

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

  const navigate = useNavigate();

  return (
    <>
      <h1 className="title">Item Index</h1>

      <div className="top-bar">
        <div className="search-container">
          <label>Search Item</label>

          <input
            type="text"
            placeholder="Search by Item Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Link to="/forms">
          <button className="add-btn">Add Item</button>
        </Link>
      </div>

      <table className="item-table" border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Supplier</th>
            <th>Purchase Date</th>
            <th>Product Code</th>
            <th>Payment Method</th>
            <th>Availability</th>
            <th>Actions</th>
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
                <td>{item.supplier}</td>
                <td>{item.purchaseDate}</td>
                <td>{item.productCode}</td>
                <td>{item.paymentMethod}</td>
                <td>{item.productAvailability}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => navigate(`/edit/${item.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default ItemIndex;
