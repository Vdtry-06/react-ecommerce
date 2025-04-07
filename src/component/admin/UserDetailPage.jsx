import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Descriptions, Table, Button, Spin, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/userDetailPage.css";

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo(userId);
  }, [userId]);

  const fetchUserInfo = async (id) => {
    setLoading(true);
    try {
      const response = await ApiService.getUserInfoById(id);
      console.log("User info response:", response);
      setUser(response.data);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch user details");
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="admin-product-list">
        <p className="no-data">Failed to load user details.</p>
      </div>
    );
  }

  const orderColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => text || "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (price !== undefined ? `$${price.toFixed(2)}` : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => text || "-",
    },
  ];

  return (
    <div className="admin-product-list">
      <div className="product-header">
        <h2>Chi tiết người dùng: {user?.username || "Loading..."}</h2>
        <Button type="primary" onClick={() => navigate("/admin/users")}>
          Quay lại
        </Button>
      </div>
      <Spin spinning={loading}>
        {user && (
          <div className="user-detail">
            <Descriptions title="Thông tin cơ bản" bordered column={1}>
              <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="First Name">{user.firstName || "-"}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{user.lastName || "-"}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{user.dateOfBirth || "-"}</Descriptions.Item>
              <Descriptions.Item label="Image">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.username} className="image-preview" />
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Roles">
                {user.roles ? user.roles.map((role) => role.name).join(", ") : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Địa chỉ" bordered column={1} style={{ marginTop: 24 }}>
              {user.address ? (
                <>
                  <Descriptions.Item label="House Number">
                    {user.address.houseNumber || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Street">{user.address.street || "-"}</Descriptions.Item>
                  <Descriptions.Item label="Ward">{user.address.ward || "-"}</Descriptions.Item>
                  <Descriptions.Item label="District">{user.address.district || "-"}</Descriptions.Item>
                  <Descriptions.Item label="City">{user.address.city || "-"}</Descriptions.Item>
                  <Descriptions.Item label="Country">{user.address.country || "-"}</Descriptions.Item>
                </>
              ) : (
                <Descriptions.Item label="Thông tin">
                  Không có thông tin địa chỉ.
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="user-orders" style={{ marginTop: 24 }}>
              <h3>Đơn hàng</h3>
              <Table
                columns={orderColumns}
                dataSource={user.orders || []}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "Không có đơn hàng nào." }}
              />
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default UserDetailPage;