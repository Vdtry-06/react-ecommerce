import { Card, Descriptions } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const UserAddressCard = ({ address }) => {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <HomeOutlined style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin địa chỉ</span>
        </div>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      {address ? (
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Số nhà" span={1}>
            {address.houseNumber || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Đường" span={1}>
            {address.street || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Phường/Xã" span={1}>
            {address.ward || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Quận/Huyện" span={1}>
            {address.district || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Thành phố" span={1}>
            {address.city || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Quốc gia" span={1}>
            {address.country || "Chưa cập nhật"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            borderRadius: "12px",
          }}
        >
          <HomeOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
          <p style={{ fontSize: "16px", margin: 0 }}>Người dùng chưa cập nhật thông tin địa chỉ</p>
        </div>
      )}
    </Card>
  );
};

export default UserAddressCard;