import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemForm.css";

function ItemForm() {
  interface ItemData {
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

  const [itemData, setItemData] = useState<ItemData>({
    itemName: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    supplier: "",
    purchaseDate: "",
    productCode: "",
    paymentMethod: "",
    productAvailability: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setItemData({
      ...itemData,

      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    });
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/items/${id}`)
        .then((response) => response.json())

        .then((data) => {
          setItemData(data);
        })

        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(itemData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/items",
        itemData,
      );

      alert("Item saved successfully!");

      console.log(response.data);
      navigate("/"); // Navigate back to the item index page
    } catch (error) {
      console.error(error);

      alert("Error saving item!");
    }
  };

  return (
    <div className="items">
      <form onSubmit={handleSubmit}>
        <div className="items-block">
          <h1>Items</h1>

          <div className="form-grid">
            <div>
              <label>Item Name </label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter Item Name"
                value={itemData.itemName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="text"
                name="price"
                placeholder="Enter Price"
                value={itemData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                placeholder="Enter Quantity"
                value={itemData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Category</label>
              <select
                name="category"
                value={itemData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Footware">Footware</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Computers">Computers & Laptops</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="Enter brand"
                value={itemData.brand}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={itemData.purchaseDate}
                onChange={handleChange}
                style={{ color: "#065F46;" }}
              />
            </div>

            <div>
              <label>Product Code</label>
              <input
                type="text"
                name="productCode"
                placeholder="Enter Product Code"
                value={itemData.productCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={itemData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">Select a payment method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Upi">UPI</option>
                <option value="Cod">Cash on Delivery</option>
              </select>
            </div>

            <div>
              <label>Product Availability</label>
              <select
                name="productAvailability"
                value={itemData.productAvailability}
                onChange={handleChange}
              >
                <option value="">Select availability</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="low Stock">Low Stock</option>
                <option value="Pre-order">Pre-order</option>
              </select>
            </div>
          </div>
          <div className="supplier-block">
            <h2>Supplier Details</h2>
            <div>
              <label>Supplier</label>
              <input
                type="text"
                name="supplier"
                placeholder="Enter supplier"
                value={itemData.supplier}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ItemForm;
