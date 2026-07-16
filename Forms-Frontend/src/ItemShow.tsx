import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "./api";
import "./ItemShow.css";

function ItemShow() {
  interface Supplier {
    id: number;
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  interface Category {
    id: number;
    categoryName: string;
  }

  interface Item {
    id: number;
    itemName: string;
    price: number;
    quantity: number;
    category: Category;
    brand: string;
    purchaseDate: string;
    productCode: string;
    paymentMethod: string;
    productAvailability: string;
    files: string;
    supplier: Supplier;
  }

  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="item-show-page">
      <div className="item-show-container">

        <div className="item-card">
           <div className="item-page-header">
          <button
            type="button"
            className="item-show-back-btn"
            onClick={() => navigate("/items")}
          >
            <ArrowLeft size={22} />
          </button>
        </div>
          <div className="item-page-title-wrapper">
          <h1 className="item-page-title">Item Details</h1>

          <p className="item-page-subtitle">View inventory item information.</p>
        </div>

          <div className="item-section-header">
            <h2 className="item-section-title">Item Information</h2>
          </div>

          <div className="item-grid">
            <div>
              <label className="item-label">Item Name</label>

              <div className="item-display-value">{item?.itemName}</div>
            </div>

            <div>
              <label className="item-label">Price</label>

              <div className="price-value">
                ₹{item?.price?.toLocaleString("en-IN")}
              </div>
            </div>

            <div>
              <label className="item-label">Quantity</label>

              <span className="quantity-badge">{item?.quantity}</span>
            </div>

            <div>
              <label className="item-label">Category</label>

              <div className="item-display-value">
                {item?.category?.categoryName}
              </div>
            </div>

            <div>
              <label className="item-label">Brand</label>

              <div className="item-display-value">{item?.brand}</div>
            </div>

            <div>
              <label className="item-label">Purchase Date</label>

              <div className="item-display-value">
                {item?.purchaseDate && formatDate(item.purchaseDate)}
              </div>
            </div>

            <div>
              <label className="item-label">Product Code</label>

              <div className="product-code">{item?.productCode}</div>
            </div>

            <div>
              <label className="item-label">Payment Method</label>

              <div className="item-display-value">{item?.paymentMethod}</div>
            </div>

            <div>
              <label className="item-label">Availability</label>

              <span
                className={`availability-badge ${item?.productAvailability.toLowerCase()}`}
              >
                {item?.productAvailability.replace(/_/g, " ")}
              </span>
            </div>

            <div>
              <label className="item-label">Files</label>

              {item?.files ? (
                <div className="file-list">
                  {item.files.split(",").map((fileName, index) => (
                    <a
                      key={index}
                      href={`http://localhost:8080/api/files/${fileName.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      📄 {fileName.substring(fileName.indexOf("_") + 1)}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="item-display-value">No Files Uploaded</div>
              )}
            </div>
          </div>

          <hr className="item-section-divider" />
          {/* Supplier Information */}

          <div className="item-section-header">
            <h2 className="item-section-title">Supplier Information</h2>
          </div>

          <div className="item-grid">
            <div>
              <label className="item-label">Supplier Name</label>

              <div className="item-display-value">
                {item?.supplier?.supplierName}
              </div>
            </div>

            <div>
              <label className="item-label">Phone Number</label>

              <div className="item-display-value">
                {item?.supplier?.phoneNumber}
              </div>
            </div>

            <div>
              <label className="item-label">Email</label>

              <div className="item-display-value">{item?.supplier?.email}</div>
            </div>

            <div>
              <label className="item-label">Address</label>

              <div className="item-display-value address-value">
                {item?.supplier?.address}
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}

          <div className="item-actions">
            <button
              type="button"
              className="item-show-back-btn2"
              onClick={() => navigate("/items")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemShow;
