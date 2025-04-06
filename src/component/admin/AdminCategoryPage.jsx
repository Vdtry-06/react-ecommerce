import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const AdminCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.log("Error fetching category list", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (confirmed) {
      try {
        await ApiService.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        window.confirm("Cannot delete: This category is linked to existing products.");
        console.log("Error deleting category by id", error);
      }
    }
  };

  return (
    <div className="admin-category-list">
      <div className="category-header">
        <h2>Quản lý danh mục</h2>
        <button className="add-btn" onClick={() => navigate("/admin/add-category")}>
          Thêm danh mục
        </button>
      </div>
      {categories.length === 0 ? (
        <p className="no-data">Chưa có danh mục nào. Thêm một danh mục để bắt đầu!</p>
      ) : (
        <div className="category-table">
          <div className="table-header">
            <span>Tên</span>
            <span>Mô tả</span>
            <span>Chỉnh sửa</span>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="table-row">
              <span>{category.name}</span>
              <span>{category.description || "-"}</span>
              <div className="admin-bt">
                <button
                  className="admin-btn-edit"
                  onClick={() => navigate(`/admin/edit-category/${category.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="admin-btn-delete"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryPage;