import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const AddCategory = () => {
  const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.addCategory(newCategory);
      if (response.code === 1000) {
        setMessage("Category added successfully!");
        setNewCategory({ name: "", description: "" });
        setTimeout(() => {
          navigate("/admin/categories");
          setMessage("");
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save category");
    }
  };

  return (
    <div className="admin-category-list">
      <h2>Thêm mới danh mục</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleAddCategorySubmit} className="category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <div className="modal-buttons">
          <button type="submit">Add Category</button>
          <button type="button" onClick={() => navigate("/admin/categories")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;