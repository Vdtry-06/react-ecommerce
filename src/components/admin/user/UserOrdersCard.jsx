import { Card, Table, Tag } from "antd";
import { ShoppingCartOutlined, CalendarOutlined } from "@ant-design/icons";

const UserOrdersCard = ({ orders }) => {
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

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          #{id}
        </span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      width: 150,
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            {text ? new Date(text).toLocaleString("vi-VN") : "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {price !== undefined ? `${price.toLocaleString("vi-VN")} VNĐ` : "-"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
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
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShoppingCartOutlined style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
            Lịch sử đơn hàng ({orders.length})
          </span>
        </div>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <Table
        columns={orderColumns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <ShoppingCartOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
              <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Người dùng chưa có đơn hàng nào</p>
            </div>
          ),
        }}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      />
    </Card>
  );
};

export default UserOrdersCard;