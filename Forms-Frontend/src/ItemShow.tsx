import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X  } from "lucide-react";
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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="item-show-container">
      <div className="item-show-card">
        <div className="page-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/items")}
          >
            <X />
          </button>
        </div>

        {/* Item Details */}
        <div className="item-section">
          <h2 className="item-h">Item Details</h2>

          <div className="details-grid">
            <div className="field">
              <strong>Item Name</strong>
              <span>{item?.itemName}</span>
            </div>

            <div className="field">
              <strong>Price</strong>
              <span>₹ {item?.price}</span>
            </div>

            <div className="field">
              <strong>Quantity</strong>
              <span>{item?.quantity}</span>
            </div>

            <div className="field">
              <strong>Category</strong>
              <span>{item?.category.categoryName}</span>
            </div>

            <div className="field">
              <strong>Brand</strong>
              <span>{item?.brand}</span>
            </div>

            <div className="field">
              <strong>Purchase Date</strong>
              <span>{item?.purchaseDate}</span>
            </div>

            <div className="field">
              <strong>Product Code</strong>
              <span>{item?.productCode}</span>
            </div>

            <div className="field">
              <strong>Payment Method</strong>
              <span>{item?.paymentMethod}</span>
            </div>

            <div className="field">
              <strong>Availability</strong>
              <span>{item?.productAvailability}</span>
            </div>

            <div className="field">
              <strong>Files</strong>

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
        </div>

        {/* Supplier Details */}
        <div className="supplier-section">
          <h2 className="supplier-h">Supplier Details</h2>

          <div className="details-grid">
            <div className="field">
              <strong>Supplier Name</strong>
              <span>{item?.supplier?.supplierName}</span>
            </div>

            <div className="field">
              <strong>Phone Number</strong>
              <span>{item?.supplier?.phoneNumber}</span>
            </div>

            <div className="field">
              <strong>Email</strong>
              <span>{item?.supplier?.email}</span>
            </div>

            <div className="field">
              <strong>Address</strong>
              <span>{item?.supplier?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemShow;
