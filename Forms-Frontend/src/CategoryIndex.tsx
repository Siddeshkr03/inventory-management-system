import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import api from "./api";
import "./CategoryIndex.css";

function CategoryIndex() {

  interface Category {
    id: number;
    categoryName: string;
    categoryCode: string;
    description: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchCategories = async () => {

    try {

      const response = await api.get("/categories");

      setCategories(response.data);

    } catch (error) {

      console.error("Error fetching categories:", error);

    }

  };

  const deleteCategory = async (id: number) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/categories/${id}`);

      fetchCategories();

    } catch (error) {

      console.error("Error deleting category:", error);

    }

  };

  useEffect(() => {

    fetchCategories();

  }, []);

  return (
    <>
      <Navbar />

      <div className="top-bar">

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Category Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <h1 className="title">Categories</h1>

        <Link to="/categories/add">

          <button className="cat-add-btn">

            Add Category

          </button>

        </Link>

      </div>

      <div className="table-wrapper">

        <table className="category-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Category Name</th>

              <th>Category Code</th>

              <th>Description</th>

              <th className="action-column">Actions</th>

            </tr>

          </thead>

          <tbody>

            {categories

              .filter((category) =>
                category.categoryName
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )

              .map((category, index) => (

                <tr key={category.id}>

                  <td>{index + 1}</td>

                  <td>{category.categoryName}</td>

                  <td>{category.categoryCode}</td>

                  <td>{category.description}</td>

                  <td className="action-column">

                    <div className="action-buttons">

                      <span
                        className="cat-edit"
                        role="button"
                        onClick={() =>
                          navigate(`/categories/edit/${category.id}`)
                        }
                      >
                        <Pencil />
                      </span>

                      <span
                        className="cat-delete"
                        role="button"
                        onClick={() => deleteCategory(category.id)}
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

export default CategoryIndex;