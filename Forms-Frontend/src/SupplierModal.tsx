import { useState } from "react";
import api from "./api";
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

interface SupplierErrors {
  supplierName: string;
  phoneNumber: string;
  email: string;
  address: string;
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

  const [errors, setErrors] = useState<SupplierErrors>({
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

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const newErrors: SupplierErrors = {
      supplierName: "",
      phoneNumber: "",
      email: "",
      address: "",
    };

    let isValid = true;

    if (supplierData.supplierName.trim() === "") {
      newErrors.supplierName = "Supplier name is required.";
      isValid = false;
    }

    if (supplierData.phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{0,10}$/.test(supplierData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain exactly 10 digits.";
      isValid = false;
    }

    if (supplierData.email.trim() === "") {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (supplierData.address.trim() === "") {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSaveSupplier = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await api.post("/suppliers", supplierData);

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
          <span className="close-button-mdl" onClick={onClose}>
            ❌
          </span>

          <h2>Add Supplier</h2>
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
            {errors.supplierName && (
              <p className="error-message">{errors.supplierName}</p>
            )}
          </div>

          <div>
            <label>Phone Number</label>

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              value={supplierData.phoneNumber}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.phoneNumber && (
              <p className="error-message">{errors.phoneNumber}</p>
            )}
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
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div>
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter Address"
              value={supplierData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
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
