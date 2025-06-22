import { Card, Descriptions, Tag } from "antd";
import { ShoppingCartOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";

const OrderInfoCard = ({ order }) => {
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

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShoppingCartOutlined style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin đơn hàng</span>
        </div>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Mã đơn hàng" span={1}>
          <span
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
              color: "#0369a1",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            #{order.id}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng" span={1}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UserOutlined style={{ color: "#64748b" }} />
            <span
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                color: "#92400e",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              User #{order.userId}
            </span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={1}>
          <Tag
            color={getStatusColor(order.status)}
            style={{
              borderRadius: "8px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: "600",
              border: "none",
            }}
          >
            {getStatusText(order.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={1}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarOutlined style={{ color: "#059669" }} />
            <span
              style={{
                color: "#059669",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {order.totalPrice.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={1}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b" }}>{new Date(order.createdDate).toLocaleString("vi-VN")}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật cuối" span={1}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b" }}>{new Date(order.lastModifiedDate).toLocaleString("vi-VN")}</span>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderInfoCard;