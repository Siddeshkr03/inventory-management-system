import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ItemForm.css";
import SupplierModal from "./SupplierModal";

function ItemForm() {
  interface ItemData {
    itemName: string;
    price: string;
    quantity: string;
    category: string;
    brand: string;
    purchaseDate: string;
    productCode: string;
    paymentMethod: string;
    productAvailability: string;

    // Supplier Fields
    supplierId: string;
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  interface Supplier {
    id: number;
    supplierName: string;
    phoneNumber: string;
    email: string;
    address: string;
  }

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [itemData, setItemData] = useState<ItemData>({
    itemName: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    purchaseDate: "",
    productCode: "",
    paymentMethod: "",
    productAvailability: "",
    supplierId: "",
    supplierName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // If Supplier dropdown changes
    if (name === "supplierName") {
      // If user selects "Add New Supplier"
      if (value === "ADD_NEW_SUPPLIER") {
        setShowSupplierModal(true);
        return;
      }

      const selectedSupplier = suppliers.find(
        (supplier) => supplier.supplierName === value,
      );

      setItemData({
        ...itemData,
        supplierId: selectedSupplier?.id.toString() || "",
        supplierName: value,
        phoneNumber: selectedSupplier?.phoneNumber || "",
        email: selectedSupplier?.email || "",
        address: selectedSupplier?.address || "",
      });

      return;
    }

    setItemData({
      ...itemData,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    });
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/items/${id}`)
        .then((response) => response.json())

        .then((data) => {
          setItemData({
            itemName: data.itemName,
            price: data.price,
            quantity: data.quantity,
            category: data.category,
            brand: data.brand,
            purchaseDate: data.purchaseDate,
            productCode: data.productCode,
            paymentMethod: data.paymentMethod,
            productAvailability: data.productAvailability,
            supplierId: data.supplier?.id?.toString() || "",
            supplierName: data.supplier?.supplierName || "",
            phoneNumber: data.supplier?.phoneNumber || "",
            email: data.supplier?.email || "",
            address: data.supplier?.address || "",
          });
        })

        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:8080/api/suppliers")
      .then((response) => response.json())
      .then((data) => {
        setSuppliers(data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("itemFormData");

    if (savedData) {
      setItemData(JSON.parse(savedData));

      localStorage.removeItem("itemFormData");
    }
  }, []);

  console.log(suppliers);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let uploadedFileName = "";

    if (files) {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const uploadResponse = await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
      );

      uploadedFileName = uploadResponse.data;
    }

    const item = {
      itemName: itemData.itemName,
      price: itemData.price,
      quantity: itemData.quantity,
      category: itemData.category,
      brand: itemData.brand,
      purchaseDate: itemData.purchaseDate,
      productCode: itemData.productCode,
      paymentMethod: itemData.paymentMethod,
      productAvailability: itemData.productAvailability,
      supplierId: Number(itemData.supplierId),
      files: uploadedFileName,
    };

    const itemSupplierDTO = {
      item,
      supplierId: Number(itemData.supplierId),
    };

    try {
      if (id) {
        await axios.put(
          `http://localhost:8080/api/items/${id}`,
          itemSupplierDTO,
        );

        alert("Updated Successfully!");
      } else {
        await axios.post("http://localhost:8080/api/items", itemSupplierDTO);

        alert("Saved Successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSupplierAdded = (newSupplier: Supplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);

    setItemData((prev) => ({
      ...prev,
      supplierId: newSupplier.id.toString(),
      supplierName: newSupplier.supplierName,
      phoneNumber: newSupplier.phoneNumber,
      email: newSupplier.email,
      address: newSupplier.address,
    }));
  };

  return (
    <div className="items">
      <form onSubmit={handleSubmit}>
        <div className="items-block">
          <h1 className="section-title">Item Details</h1>
          <hr className="section-divider" />

          <div className="form-grid">
            <div>
              <label>Item Name </label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter Item Name"
                value={itemData.itemName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="text"
                name="price"
                placeholder="Enter Price"
                value={itemData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                placeholder="Enter Quantity"
                value={itemData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Category</label>
              <select
                name="category"
                value={itemData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Footware">Footware</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Computers">Computers & Laptops</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="Enter brand"
                value={itemData.brand}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={itemData.purchaseDate}
                onChange={handleChange}
                style={{ color: "#065F46;" }}
              />
            </div>

            <div>
              <label>Product Code</label>
              <input
                type="text"
                name="productCode"
                placeholder="Enter Product Code"
                value={itemData.productCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={itemData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">Select a payment method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Upi">UPI</option>
                <option value="Cod">Cash on Delivery</option>
              </select>
            </div>

            <div>
              <label>Product Availability</label>
              <select
                name="productAvailability"
                value={itemData.productAvailability}
                onChange={handleChange}
              >
                <option value="">Select availability</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="low Stock">Low Stock</option>
                <option value="Pre-order">Pre-order</option>
              </select>
            </div>
            <div>
              <label>Upload File</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
              />
            </div>
          </div>
          <div className="supplier-block">
            <h2 className="section-title">Supplier Details</h2>
            <div className="form-grid">
              <div>
                <label>Supplier Name</label>

                <select
                  name="supplierName"
                  value={itemData.supplierName}
                  onChange={handleChange}
                >
                  <option value="">Select Supplier</option>

                  {Array.from(
                    new Map(
                      suppliers
                        .filter(
                          (supplier) =>
                            supplier.supplierName &&
                            supplier.supplierName.trim() !== "",
                        )
                        .map((supplier) => [supplier.supplierName, supplier]),
                    ).values(),
                  ).map((supplier) => (
                    <option key={supplier.id} value={supplier.supplierName}>
                      {supplier.supplierName}
                    </option>
                  ))}

                  <option value="ADD_NEW_SUPPLIER" className="add-btn">
                    Add New Supplier
                  </option>
                </select>
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter Phone nuumber"
                  name="phoneNumber"
                  value={itemData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={itemData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Address</label>

                <textarea
                  name="address"
                  placeholder="Enter Address"
                  value={itemData.address}
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      address: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    minHeight: "20px",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSupplierAdded={handleSupplierAdded}
      />
    </div>
  );
}

export default ItemForm;
