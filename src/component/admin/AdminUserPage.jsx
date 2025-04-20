import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/adminUserPage.css";

const AdminUserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.User.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      onOk: async () => {
        setLoading(true);
        try {
          await ApiService.User.deleteUser(userId);
          setUsers(users.filter((user) => user.id !== userId));
          message.success("User deleted successfully");
        } catch (error) {
          message.error(error.response?.data?.message || "Failed to delete user");
          console.error("Error deleting user:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => text || "-",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => text || "-",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => text || "-",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        url ? (
          <img src={url} alt="user" className="image-preview" />
        ) : (
          "-"
        )
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/admin/user-detail/${record.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="admin-product-list">
      <h2>Quản lý người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "Chưa có người dùng nào." }}
      />
    </div>
  );
};

export default AdminUserPage;