import { useState, useEffect } from "react";
import { Card } from "antd";
import UsersHeader from "../../../components/admin/user/UserHeader";
import UsersTable from "../../../components/admin/user/UserTable";
import UserDeleteModal from "../../../components/admin/user/UserDeleteModal";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.User.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải danh sách người dùng");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.User.deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
      message.success("Người dùng đã được xóa thành công");
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể xóa người dùng");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setUserToDelete(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      <UsersHeader />
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <UsersTable users={users} loading={loading} onDelete={handleDeleteUser} />
      </Card>
      <UserDeleteModal
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default AdminUserPage;