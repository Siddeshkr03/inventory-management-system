import { useState } from "react";
import api from "./api";
import "./CategoryModal.css";

interface Category {
  id: number;
  categoryName: string;
  categoryCode: string;
  description: string;
}

interface CategoryData {
  categoryName: string;
  categoryCode: string;
  description: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (category: Category) => void;
}

interface CategoryErrors {
  categoryName: string;
  categoryCode: string;
  description: string;
}

function CategoryModal({
  isOpen,
  onClose,
  onCategoryAdded,
}: CategoryModalProps) {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categoryName: "",
    categoryCode: "",
    description: "",
  });

  const [errors, setErrors] = useState<CategoryErrors>({
    categoryName: "",
    categoryCode: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setCategoryData({
      ...categoryData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const resetForm = () => {
    setCategoryData({
      categoryName: "",
      categoryCode: "",
      description: "",
    });

    setErrors({
      categoryName: "",
      categoryCode: "",
      description: "",
    });
  };

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const newErrors: CategoryErrors = {
      categoryName: "",
      categoryCode: "",
      description: "",
    };

    let isValid = true;

    if (categoryData.categoryName.trim() === "") {
      newErrors.categoryName = "Category name is required.";
      isValid = false;
    }

    if (categoryData.categoryCode.trim() === "") {
      newErrors.categoryCode = "Category code is required.";
      isValid = false;
    }

    if (categoryData.description.trim() === "") {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post("/categories", categoryData);

      onCategoryAdded(response.data);

      resetForm();

      onClose();

      alert("Category added successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save category.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Category</h2>
          <button
            type="button"
            className="close-button-mdl-cat"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <div className="form-grid">
          <div>
            <label>Category Name</label>

            <input
              type="text"
              name="categoryName"
              placeholder="Enter Category Name"
              value={categoryData.categoryName}
              onChange={handleChange}
            />

            {errors.categoryName && (
              <p className="error-message">{errors.categoryName}</p>
            )}
          </div>

          <div>
            <label>Category Code</label>

            <input
              type="text"
              name="categoryCode"
              placeholder="Enter Category Code"
              value={categoryData.categoryCode}
              onChange={handleChange}
            />

            {errors.categoryCode && (
              <p className="error-message">{errors.categoryCode}</p>
            )}
          </div>

          <div>
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter Description"
              value={categoryData.description}
              onChange={handleChange}
            />

            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="save-btn-container-mdl">
          <button type="button" onClick={handleSaveCategory}>
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
