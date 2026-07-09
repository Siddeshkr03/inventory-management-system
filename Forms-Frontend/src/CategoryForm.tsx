import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./CategoryForm.css";

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

        const response =
          await api.get(`/categories/${id}`);

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {

      if (id) {

        await api.put(
          `/categories/${id}`,
          categoryData
        );

        alert("Category Updated Successfully!");

      } else {

        await api.post(
          "/categories",
          categoryData
        );

        alert("Category Added Successfully!");

      }

      navigate("/categories");

    } catch (error) {

      console.error(error);

      alert("Error saving category!");

    }

  };

  return (

    <div className="supplier-page">

      <form
        className="supplier-form"
        onSubmit={handleSubmit}
      >

        <div className="page-header">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/categories")}
          >
            ⬅
          </button>

        </div>

        <div className="supplier-block">

          <h1 className="title">

            {id ? "Edit Category" : "Add Category"}

          </h1>

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
                <p className="error">
                  {errors.categoryName}
                </p>
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
                <p className="error">
                  {errors.categoryCode}
                </p>
              )}

            </div>

            <div>

              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter Description"
                value={categoryData.description}
                onChange={handleChange}
                style={{
                  width: "100%",
                  minHeight: "40px",
                  resize: "vertical",
                }}
              />

              {errors.description && (
                <p className="error">
                  {errors.description}
                </p>
              )}

            </div>

          </div>

          <button
            className="submit-btn-sup"
            type="submit"
          >
            {id ? "Update Category" : "Save Category"}
          </button>

        </div>

      </form>

    </div>

  );

}

export default CategoryForm;