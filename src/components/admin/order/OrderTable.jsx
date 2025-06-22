import { Table, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons";

const OrdersTable = ({ orders }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "#f59e0b",
      PAID: "#10b981",
      CANCELLED: "#ef4444",
      PROCESSING: "#3b82f6",
      DELIVERED: "#059669",
    };
    return statusColors[status] || "#64748b";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: "Chờ xử lý",
      PAID: "Đã thanh toán",
      CANCELLED: "Đã hủy",
      PROCESSING: "Đang xử lý",
      DELIVERED: "Đã giao",
    };
    return statusTexts[status] || status;
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (id) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          #{id}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            color: "#7c3aed",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          User #{userId}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: "8px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: "600",
            border: "none",
          }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          {price.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: "14px" }}>{new Date(date).toLocaleString("vi-VN")}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/orders/${record.id}`)}
          style={{
            borderRadius: "8px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none",
            fontWeight: "600",
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
      }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    />
  );
};

export default OrdersTable;