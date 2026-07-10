import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./ItemForm.css";

import SupplierModal from "./SupplierModal";
import CategoryModal from "./CategoryModal";

function ItemForm() {
  interface ItemData {
    itemName: string;
    price: string;
    quantity: string;
    category: string;
    categoryId: string;
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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [itemData, setItemData] = useState<ItemData>({
    itemName: "",
    price: "",
    quantity: "",
    category: "",
    categoryId: "",
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

    if (name === "category") {
      if (value === "ADD_NEW_CATEGORY") {
        setShowCategoryModal(true);

        return;
      }

      const selectedCategory = categories.find(
        (category) => category.categoryName === value,
      );

      setItemData({
        ...itemData,
        category: value,
        categoryId: selectedCategory?.id.toString() || "",
      });

      setErrors({
        ...errors,
        category: "",
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
          category: data.category?.categoryName || "",
          categoryId: data.category?.id?.toString() || "",
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
      categoryId: Number(itemData.categoryId),
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

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);

    setItemData((prev) => ({
      ...prev,
      category: newCategory.categoryName,
      categoryId: newCategory.id.toString(),
    }));
  };

  return (
    <div className="item-page">
      <form className="item-container" onSubmit={handleSubmit}>
        <div className="item-card">
          <div className="item-page-header">
          <button
            type="button"
            className="item-back-btn"
            onClick={() => navigate("/items")}
          >
            ⬅
          </button>
        </div>
          <div className="item-page-title-wrapper">
            <h1 className="item-page-title">{id ? "Edit Item" : "Add Item"}</h1>

            <p className="item-page-subtitle">
              Create and manage inventory items.
            </p>
          </div>
          <div className="item-section-card">
            <div className="item-section-header">
              <h2 className="item-section-title">Item Information</h2>
            </div>

            <div className="item-grid">
              <div>
                <label className="item-label">Item Name </label>
                <input
                  className="item-input"
                  type="text"
                  name="itemName"
                  placeholder="Enter Item Name"
                  value={itemData.itemName}
                  onChange={handleChange}
                />
                {errors.itemName && (
                  <p className="item-error">{errors.itemName}</p>
                )}
              </div>

              <div>
                <label className="item-label">Price</label>
                <input
                  className="item-input"
                  type="number"
                  name="price"
                  placeholder="Enter Price"
                  value={itemData.price}
                  onChange={handleChange}
                />
                {errors.price && <p className="item-error">{errors.price}</p>}
              </div>

              <div>
                <label className="item-label">Quantity</label>
                <input
                  className="item-input"
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  value={itemData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && (
                  <p className="item-error">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="item-label">Category</label>
                <select
                  className="item-select"
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}

                  <option value="ADD_NEW_CATEGORY" className="item-add-btn">
                    Add New Category
                  </option>
                </select>
              </div>

              <div>
                <label className="item-label">Brand</label>
                <input
                  className="item-input"
                  type="text"
                  name="brand"
                  placeholder="Enter brand"
                  value={itemData.brand}
                  onChange={handleChange}
                />
                {errors.brand && <p className="item-error">{errors.brand}</p>}
              </div>

              <div>
                <label className="item-label">Purchase Date</label>
                <input
                  className="item-input"
                  type="date"
                  name="purchaseDate"
                  value={itemData.purchaseDate}
                  onChange={handleChange}
                />
                {errors.purchaseDate && (
                  <p className="item-error">{errors.purchaseDate}</p>
                )}
              </div>

              <div>
                <label className="item-label">Product Code</label>
                <input
                  className="item-input"
                  type="text"
                  name="productCode"
                  placeholder="Enter Product Code"
                  value={itemData.productCode}
                  onChange={handleChange}
                />
                {errors.productCode && (
                  <p className="item-error">{errors.productCode}</p>
                )}
              </div>

              <div>
                <label className="item-label">Payment Method</label>
                <select
                  className="item-select"
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
                  <p className="item-error">{errors.paymentMethod}</p>
                )}
              </div>

              <div>
                <label className="item-label">Product Availability</label>
                <select
                  className="item-select"
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
                  <p className="item-error">{errors.productAvailability}</p>
                )}
              </div>
              <div>
                <label className="item-label">Upload File</label>
                <input
                  className="item-file-input"
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
            <div className="item-section-card">
              <div className="item-section-header">
                <h2 className="item-section-title">Supplier Information</h2>
              </div>

              <div className="item-grid">
                <div>
                  <label className="item-label">Supplier Name</label>

                  <select
                    className="item-select"
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

                    <option value="ADD_NEW_SUPPLIER" className="item-add-btn">
                      Add New Supplier
                    </option>
                  </select>
                  {errors.supplier && (
                    <p className="item-error">{errors.supplier}</p>
                  )}
                </div>

                <div>
                  <label className="item-label">Phone Number</label>
                  <input
                    className="item-input"
                    type="text"
                    placeholder="Enter Phone nuumber"
                    name="phoneNumber"
                    value={itemData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="item-label">Email</label>
                  <input
                    className="item-input"
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                    value={itemData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="item-label">Address</label>

                  <textarea
                    className="item-textarea"
                    name="address"
                    placeholder="Enter Address"
                    value={itemData.address}
                    onChange={(e) =>
                      setItemData({
                        ...itemData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="item-actions">
              <button
                type="button"
                className="item-cancel-btn"
                onClick={() => navigate("/items")}
              >
                Cancel
              </button>

              <button className="item-submit-btn" type="submit">
                {id ? "Update Item" : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSupplierAdded={handleSupplierAdded}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </div>
  );
}

export default ItemForm;
