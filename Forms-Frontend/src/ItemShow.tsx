import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ItemShow.css";

function ItemShow() {
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
    price: number;
    quantity: number;
    category: string;
    brand: string;
    purchaseDate: string;
    productCode: string;
    paymentMethod: string;
    productAvailability: string;
    files: string;
    supplier: Supplier;
  }

  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/items/${id}`);

      setItem(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

return (
  <div className="item-show-container">
    <div className="item-show-card">
      <h1 className="title">Item Details</h1>

      <div className="details-grid">
        <div className="detail-box">
          <label>Item Name</label>
          <span>{item?.itemName}</span>
        </div>

        <div className="detail-box">
          <label>Price</label>
          <span>₹ {item?.price}</span>
        </div>

        <div className="detail-box">
          <label>Quantity</label>
          <span>{item?.quantity}</span>
        </div>

        <div className="detail-box">
          <label>Category</label>
          <span>{item?.category}</span>
        </div>

        <div className="detail-box">
          <label>Brand</label>
          <span>{item?.brand}</span>
        </div>

        <div className="detail-box">
          <label>Purchase Date</label>
          <span>{item?.purchaseDate}</span>
        </div>

        <div className="detail-box">
          <label>Product Code</label>
          <span>{item?.productCode}</span>
        </div>

        <div className="detail-box">
          <label>Payment Method</label>
          <span>{item?.paymentMethod}</span>
        </div>

        <div className="detail-box">
          <label>Availability</label>
          <span>{item?.productAvailability}</span>
        </div>

        <div className="detail-box">
          <label>Files</label>

          {item?.files ? (
            <div className="file-list">
              {item.files.split(",").map((fileName, index) => (
                <a
                  key={index}
                  className="file-link"
                  href={`http://localhost:8080/api/files/${fileName.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {fileName.substring(fileName.indexOf("_") + 1)}
                </a>
              ))}
            </div>
          ) : (
            <span>No Files Uploaded</span>
          )}
        </div>
      </div>

      <h2 className="section-title">Supplier Details</h2>

      <div className="details-grid">
        <div className="detail-box">
          <label>Supplier Name</label>
          <span>{item?.supplier?.supplierName}</span>
        </div>

        <div className="detail-box">
          <label>Phone Number</label>
          <span>{item?.supplier?.phoneNumber}</span>
        </div>

        <div className="detail-box">
          <label>Email</label>
          <span>{item?.supplier?.email}</span>
        </div>

        <div className="detail-box">
          <label>Address</label>
          <span>{item?.supplier?.address}</span>
        </div>
      </div>
    </div>
  </div>
);
}

export default ItemShow;
