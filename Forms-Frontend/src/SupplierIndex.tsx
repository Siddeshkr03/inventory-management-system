import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import api from "./api";
import "./SupplierIndex.css";
import { toast } from "react-toastify";

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
      const response = await api.get("/suppliers");

      console.log(response.data);

      setSuppliers(response.data);
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

    toast.success("Supplier Deleted");

    try {
      await api.delete(`/suppliers/${id}`);

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
          <button className="sup-add-btn">Add Supplier</button>
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
              .map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.phoneNumber || "-"}</td>
                  <td>{supplier.email || "-"}</td>
                  <td>{supplier.address || "-"}</td>

                  <td className="action-column">
                    <div className="action-buttons">
                      <span
                        className="sup-edit"
                        role="button"
                        onClick={() =>
                          navigate(`/suppliers/edit/${supplier.id}`)
                        }
                      >
                        <Pencil />
                      </span>

                      <span
                        className="sup-delete"
                        role="button"
                        onClick={() => deleteSupplier(supplier.id)}
                      >
                        <Trash2 />
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
