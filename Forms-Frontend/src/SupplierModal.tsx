import { useState } from "react";
import axios from "axios";
import "./SupplierModal.css";

interface SupplierData {
  supplierName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierAdded: (supplier: any) => void;
}

function SupplierModal({
  isOpen,
  onClose,
  onSupplierAdded,
}: SupplierModalProps) {
  const [supplierData, setSupplierData] = useState<SupplierData>({
    supplierName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSupplierData({
      ...supplierData,
      [name]: value,
    });
  };

  if (!isOpen) {
    return null;
  }

  const handleSaveSupplier = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/suppliers",
        supplierData,
      );

      onSupplierAdded(response.data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Supplier</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label>Supplier Name</label>

            <input
              type="text"
              name="supplierName"
              placeholder="Enter Supplier Name"
              value={supplierData.supplierName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Phone Number</label>

            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              value={supplierData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={supplierData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter Address"
              value={supplierData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="save-btn-container">
          <button type="button" onClick={handleSaveSupplier}>
            Save Supplier
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierModal;
