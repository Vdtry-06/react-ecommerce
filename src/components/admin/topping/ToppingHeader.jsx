import { Typography, Button } from "antd";
import { PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ToppingHeader = ({ onAdd }) => {
  return (
    <div
      style={{
        marginTop: -20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlusCircleOutlined style={{ color: "white", fontSize: "20px" }} />
        </div>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Quản lý Toppings
        </Title>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{
          height: "48px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          border: "none",
          fontSize: "16px",
          fontWeight: "600",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        Thêm topping
      </Button>
    </div>
  );
};

export default ToppingHeader;