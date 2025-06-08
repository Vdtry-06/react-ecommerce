import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const { Title } = Typography;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.Order.getAllOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ID người dùng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/admin/orders/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20, color: "#333" }}>Quản lý đơn hàng</h2>
      {loading ? (
        <Spin tip="Đang tải danh sách đơn hàng..." />
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;