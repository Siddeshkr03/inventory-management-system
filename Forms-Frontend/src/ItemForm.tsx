import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api";
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

  interface Category {
    id: number;
    categoryName: string;
    categoryCode: string;
    description: string;
  }

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const [errors, setErrors] = useState({
    itemName: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    purchaseDate: "",
    productCode: "",
    paymentMethod: "",
    productAvailability: "",
    supplier: "",
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

      setErrors({
        ...errors,
        supplier: "",
      });
      return;
    }

    setItemData({
      ...itemData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);

        const data = response.data;

        setItemData({
          itemName: data.itemName,
          price: String(data.price),
          quantity: String(data.quantity),
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/suppliers");

        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("itemFormData");

    if (savedData) {
      setItemData(JSON.parse(savedData));

      localStorage.removeItem("itemFormData");
    }
  }, []);

  console.log(suppliers);
  console.log(categories);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    let uploadedFileName = "";

    if (files.length > 0) {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const uploadResponse = await api.post("/files/upload", formData);

      uploadedFileName = uploadResponse.data;
    }

    const item = {
      itemName: itemData.itemName,
      price: Number(itemData.price),
      quantity: Number(itemData.quantity),
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
        await api.put(`/items/${id}`, itemSupplierDTO);

        alert("Updated Successfully!");
      } else {
        await api.post("/items", itemSupplierDTO);

        alert("Saved Successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    const newErrors = {
      itemName: "",
      price: "",
      quantity: "",
      category: "",
      brand: "",
      purchaseDate: "",
      productCode: "",
      paymentMethod: "",
      productAvailability: "",
      supplier: "",
    };

    let isValid = true;

    if (!itemData.itemName.trim()) {
      newErrors.itemName = "Item Name is required";
      isValid = false;
    }

    if (itemData.price.trim() === "") {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(Number(itemData.price))) {
      newErrors.price = "Price must be a number";
      isValid = false;
    } else if (Number(itemData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    if (itemData.quantity.trim() === "") {
      newErrors.quantity = "Quantity is required";
      isValid = false;
    } else if (isNaN(Number(itemData.quantity))) {
      newErrors.quantity = "Quantity must be a number";
      isValid = false;
    } else if (Number(itemData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    if (!itemData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!itemData.brand.trim()) {
      newErrors.brand = "Brand is required";
      isValid = false;
    }

    if (!itemData.purchaseDate) {
      newErrors.purchaseDate = "Purchase Date is required";
      isValid = false;
    }

    if (!itemData.productCode.trim()) {
      newErrors.productCode = "Product Code is required";
      isValid = false;
    }

    if (!itemData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
      isValid = false;
    }

    if (!itemData.productAvailability) {
      newErrors.productAvailability = "Please select availability";
      isValid = false;
    }

    if (!itemData.supplierId) {
      newErrors.supplier = "Please select a supplier";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
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
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="page-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/items")}
          >
            ⬅
          </button>
        </div>
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
              {errors.itemName && <p className="error">{errors.itemName}</p>}
            </div>

            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter Price"
                value={itemData.price}
                onChange={handleChange}
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>

            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter Quantity"
                value={itemData.quantity}
                onChange={handleChange}
              />
              {errors.quantity && <p className="error">{errors.quantity}</p>}
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
              {errors.category && <p className="error">{errors.category}</p>}
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
              {errors.brand && <p className="error">{errors.brand}</p>}
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
              {errors.purchaseDate && (
                <p className="error">{errors.purchaseDate}</p>
              )}
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
              {errors.productCode && (
                <p className="error">{errors.productCode}</p>
              )}
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
              {errors.paymentMethod && (
                <p className="error">{errors.paymentMethod}</p>
              )}
            </div>

            <div>
              <label>Product Availability</label>
              <select
                name="productAvailability"
                value={itemData.productAvailability}
                onChange={handleChange}
              >
                <option value="">Select availability</option>

                <option value="IN_STOCK">In Stock</option>

                <option value="LOW_STOCK">Low Stock</option>

                <option value="OUT_OF_STOCK">Out of Stock</option>

                <option value="PRE_ORDER">Pre-order</option>
              </select>
              {errors.productAvailability && (
                <p className="error">{errors.productAvailability}</p>
              )}
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
                {errors.supplier && <p className="error">{errors.supplier}</p>}
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
        <button className="submit-btn" type="submit">
          Submit
        </button>
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
