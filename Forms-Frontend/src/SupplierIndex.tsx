import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./SupplierIndex.css";

function SupplierIndex() {
  interface Supplier {
    id: number;
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/suppliers");

      const data = await response.json();

      console.log(data);

      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const deleteSupplier = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await fetch(`http://localhost:8080/api/suppliers/${id}`, {
        method: "DELETE",
      });

      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <>
      <Navbar />

      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Supplier Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <h1 className="title">Suppliers</h1>

        <Link to="/suppliers/add" state={{ from: "supplierIndex" }}>
          <button className="add-btn">Add Supplier</button>
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="supplier-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Address</th>
              <th className="action-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers
              .filter((supplier) =>
                supplier.supplierName
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.id}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.phoneNumber || "-"}</td>
                  <td>{supplier.email || "-"}</td>
                  <td>{supplier.address || "-"}</td>

                  <td className="action-column">
                    <div className="action-buttons">
                      <span
                        className="edit"
                        role="button"
                        onClick={() =>
                          navigate(`/suppliers/edit/${supplier.id}`)
                        }
                      >
                        ✏️
                      </span>

                      <span
                        className="delete"
                        role="button"
                        onClick={() => deleteSupplier(supplier.id)}
                      >
                        🗑️
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SupplierIndex;
