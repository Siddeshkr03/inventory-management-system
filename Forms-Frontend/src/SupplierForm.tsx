import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/suppliers/${id}`)
        .then((response) => response.json())

        .then((data) => {
          setSupplierData({
            supplierName: data.supplierName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            address: data.address,
          });
        })

        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSupplierData({
      ...supplierData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(
          `http://localhost:8080/api/suppliers/${id}`,
          supplierData,
        );

        alert("Supplier Updated Successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/suppliers",
          supplierData,
        );

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

          <button type="submit">Save Supplier</button>
        </div>
      </form>
    </div>
  );
}

export default SupplierForm;
