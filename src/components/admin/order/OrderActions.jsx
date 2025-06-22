import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const OrderActions = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/orders")}
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
        Quay lại danh sách đơn hàng
      </Button>
    </div>
  );
};

export default OrderActions;