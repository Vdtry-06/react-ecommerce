import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../../service/ApiService";
import "../../../static/style/adminPage.css";

const EditCategory = () => {
  const { categoryId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) fetchCategory(categoryId);
  }, [categoryId]);

  const fetchCategory = async (id) => {
    try {
      const response = await ApiService.Category.getCategory(id);
      if (response.data) {
        setName(response.data.name || "");
        setDescription(response.data.description || "");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to get category");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.Category.updateCategory(categoryId, { name, description });
      if (response.data && response.data.id) {
        setMessage("Update Successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/admin/categories");
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to save a category");
    }
  };

  return (
    <div className="admin-category-list">
      <div className="category-header">
        <h2>Edit Category</h2>
            <button className="add-btn" onClick={() => navigate("/admin/categories")}>
                Quay lại
            </button>
        </div>
      {message && <p className={`message ${message.includes("Failed") ? "error" : ""}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="modal-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/admin/categories")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;