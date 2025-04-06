import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const AdminUserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getAllUsers();
      setUsers(response.data || []);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        await ApiService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  return (
    <div className="admin-product-list">
      <div className="product-header">
        <h2>Quản lý người dùng</h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      {users.length === 0 ? (
        <p className="no-data">Chưa có người dùng nào.</p>
      ) : (
        <div className="product-table">
          <div className="table-header">
            <span>ID</span>
            <span>Username</span>
            <span>Email</span>
            <span>Name</span>
            <span>Last Name</span>
            <span>Date of Birth</span>
            <span>Image</span>
            <span>Thao tác</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <span>{user.id}</span>
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>{user.firstName || "-"}</span>
              <span>{user.lastName || "-"}</span>
              <span>{user.dateOfBirth || "-"}</span>
              <span>
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.username} className="image-preview" />
                ) : (
                  "-"
                )}
              </span>
              <div className="admin-bt">
                <button
                  className="admin-btn-edit"
                  onClick={() => navigate(`/admin/user-detail/${user.id}`)}
                >
                  Chi tiết
                </button>
                <button
                  className="admin-btn-delete"
                  onClick={() => handleDeleteUser(user.id)}
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

export default AdminUserPage;