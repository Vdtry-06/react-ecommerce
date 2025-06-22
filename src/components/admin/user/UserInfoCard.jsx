import { Card, Descriptions, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserInfoCard = ({ user }) => {
  return (
    <Card
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
      bodyStyle={{ padding: "32px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
        {user.imageUrl ? (
          <Avatar
            src={user.imageUrl}
            size={80}
            style={{
              border: "4px solid #e2e8f0",
            }}
          />
        ) : (
          <Avatar
            icon={<UserOutlined />}
            size={80}
            style={{
              backgroundColor: "#3b82f6",
              border: "4px solid #e2e8f0",
            }}
          />
        )}
        <div>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "4px 0" }}>{user.username}</p>
          <p style={{ color: "#64748b", fontSize: "16px", margin: "4px 0" }}>{user.email}</p>
          {user.role && (
            <Tag
              style={{
                background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                color: "#7c3aed",
                border: "none",
                borderRadius: "8px",
                padding: "4px 12px",
                fontWeight: "600",
              }}
            >
              {user.role.name}
            </Tag>
          )}
        </div>
      </div>

      <Descriptions
        title={<span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin cơ bản</span>}
        bordered
        column={2}
        size="middle"
      >
        <Descriptions.Item label="ID" span={1}>
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
            #{user.id}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Tên đăng nhập" span={1}>
          {user.username}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={1}>
          {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh" span={1}>
          {user.dateOfBirth || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên" span={1}>
          {user.firstName || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Họ" span={1}>
          {user.lastName || "Chưa cập nhật"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserInfoCard;