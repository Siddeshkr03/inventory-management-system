import "./SupplierForm.css";import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setSupplierData({
      ...supplierData,
      [name]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/suppliers",
        supplierData
      );

      alert("Supplier Added Successfully!");

      navigate("/forms");
    } catch (error) {
      console.error(error);
      alert("Error adding supplier!");
    }
  };

  return (
    <div className="supplier-page">
      <form onSubmit={handleSubmit}>

        <div className="supplier-block">

          <h1>Add Supplier</h1>

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
                style={{
                  width: "100%",
                  minHeight: "40px",
                  resize: "vertical",
                }}
              />
            </div>

          </div>

          <button type="submit">
            Save Supplier
          </button>

        </div>

      </form>
    </div>
  );
}

export default SupplierForm;

