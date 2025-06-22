import { Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title } = Typography;

const OrdersHeader = () => {
  return (
    <div
      style={{
        marginTop: -20,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "32px",
      }}
    >
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
        <ShoppingCartOutlined style={{ color: "white", fontSize: "20px" }} />
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
        Quản lý đơn hàng
      </Title>
    </div>
  );
};

export default OrdersHeader;