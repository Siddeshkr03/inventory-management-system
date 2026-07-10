import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "./api";
import "./SupplierForm.css";

function SupplierForm() {
  interface SupplierData {
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  const [supplierData, setSupplierData] = useState<SupplierData>({
    supplierName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    supplierName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchSupplier = async () => {
      try {
        const response = await api.get(`/suppliers/${id}`);

        const data = response.data;

        setSupplierData({
          supplierName: data.supplierName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setSupplierData({
      ...supplierData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors = {
      supplierName: "",
      phoneNumber: "",
      email: "",
      address: "",
    };

    let isValid = true;

    if (!supplierData.supplierName.trim()) {
      newErrors.supplierName = "Supplier Name is required";
      isValid = false;
    }

    if (!supplierData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(supplierData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be 10 digits";
      isValid = false;
    }

    if (!supplierData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(supplierData.email)
    ) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!supplierData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (id) {
        await api.put(`/suppliers/${id}`, supplierData);

        alert("Supplier Updated Successfully!");
      } else {
        const response = await api.post("/suppliers", supplierData);

        localStorage.setItem("newSupplierId", response.data.id.toString());

        alert("Supplier Added Successfully!");
      }

      if (location.state?.from === "itemForm") {
        navigate("/items/add");
      } else {
        navigate("/suppliers");
      }
    } catch (error) {
      console.error(error);

      alert("Error saving supplier!");
    }
  };

  return (
    <div className="supplier-page">
      <form className="supplier-container" onSubmit={handleSubmit}>
        <div className="supplier-page-header">
          <button
            type="button"
            className="supplier-back-btn"
            onClick={() => navigate("/suppliers")}
          >
            ⬅
          </button>
        </div>

        <div className="supplier-details-card">
          <h1 className="supplier-page-title">
            {id ? "Edit Supplier" : "Add Supplier"}
          </h1>

          <div className="supplier-grid">
            <div>
              <label className="supplier-label">Supplier Name</label>

              <input
                className="supplier-input"
                type="text"
                name="supplierName"
                placeholder="Enter Supplier Name"
                value={supplierData.supplierName}
                onChange={handleChange}
              />

              {errors.supplierName && (
                <p className="supplier-error">{errors.supplierName}</p>
              )}
            </div>

            <div>
              <label className="supplier-label">Phone Number</label>

              <input
                className="supplier-input"
                type="tel"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={supplierData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
              />

              {errors.phoneNumber && (
                <p className="supplier-error">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="supplier-label">Email</label>

              <input
                className="supplier-input"
                type="email"
                name="email"
                placeholder="Enter Email"
                value={supplierData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="supplier-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="supplier-label">Address</label>

              <textarea
                className="supplier-textarea"
                name="address"
                placeholder="Enter Address"
                value={supplierData.address}
                onChange={handleChange}
                style={{
                  width: "100%",
                  minHeight: "40px",
                  resize: "vertical",
                }}
              />

              {errors.address && (
                <p className="supplier-error">{errors.address}</p>
              )}
            </div>
          </div>

          <button
            className="supplier-submit-btn"
            type="submit"
          >
            {id ? "Update Supplier" : "Save Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SupplierForm;