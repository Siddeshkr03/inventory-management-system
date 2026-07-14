import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./CategoryForm.css";
import { toast } from "react-toastify";

function CategoryForm() {
  interface CategoryData {
    categoryName: string;
    categoryCode: string;
    description: string;
  }

  const [categoryData, setCategoryData] = useState<CategoryData>({
    categoryName: "",
    categoryCode: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    categoryName: "",
    categoryCode: "",
    description: "",
  });

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const response = await api.get(`/categories/${id}`);

        const data = response.data;

        setCategoryData({
          categoryName: data.categoryName,
          categoryCode: data.categoryCode,
          description: data.description,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
  }, [id]);

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

  const validate = () => {
    const newErrors = {
      categoryName: "",
      categoryCode: "",
      description: "",
    };

    let isValid = true;

    if (!categoryData.categoryName.trim()) {
      newErrors.categoryName = "Category Name is required";
      isValid = false;
    }

    if (!categoryData.categoryCode.trim()) {
      newErrors.categoryCode = "Category Code is required";
      isValid = false;
    }

    if (!categoryData.description.trim()) {
      newErrors.description = "Description is required";
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
        await api.put(`/categories/${id}`, categoryData);

        toast.success("Category Updated Successfully")
      } else {
        await api.post("/categories", categoryData);

        toast.success("Category Added Successfully!");
      }

      navigate("/categories");
    } catch (error) {
      console.error(error);

      alert("Error saving category!");
    }
  };

  return (
    <div className="category-page">
      <form className="category-container" onSubmit={handleSubmit}>
        <div className="category-page-header">
          <button
            type="button"
            className="category-back-btn"
            onClick={() => navigate("/categories")}
          >
            ⬅
          </button>
        </div>

        <div className="category-page-title-wrapper">
          <h1 className="category-page-title">
            {id ? "Edit Category" : "Add Category"}
          </h1>

          <p className="category-page-subtitle">
            Create and manage product categories.
          </p>
        </div>

        <div className="category-details-card">
          <div className="category-grid">
            <div>
              <label className="category-label">Category Name</label>

              <input
                className="category-input"
                type="text"
                name="categoryName"
                placeholder="Enter Category Name"
                value={categoryData.categoryName}
                onChange={handleChange}
              />

              {errors.categoryName && (
                <p className="category-error">{errors.categoryName}</p>
              )}
            </div>

            <div>
              <label className="category-label">Category Code</label>

              <input
                className="category-input"
                type="text"
                name="categoryCode"
                placeholder="Enter Category Code"
                value={categoryData.categoryCode}
                onChange={handleChange}
              />

              {errors.categoryCode && (
                <p className="category-error">{errors.categoryCode}</p>
              )}
            </div>

            <div>
              <label className="category-label">Description</label>

              <textarea
                className="category-textarea"
                name="description"
                placeholder="Enter Description"
                value={categoryData.description}
                onChange={handleChange}
              />

              {errors.description && (
                <p className="category-error">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="category-actions">
            <button
              type="button"
              className="category-cancel-btn"
              onClick={() => navigate("/categories")}
            >
              Cancel
            </button>

            <button className="category-submit-btn" type="submit">
              {id ? "Update Category" : "Save Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;
