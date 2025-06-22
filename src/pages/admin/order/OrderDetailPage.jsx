import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Alert, Button, Typography } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import OrderInfoCard from "../../../components/admin/order/OrderInfoCard";
import OrderItemsCard from "../../../components/admin/order/OrderItemsCard";
import OrderActions from "../../../components/admin/order/OrderActions";
import ApiService from "../../../service/ApiService";

const { Title } = Typography;

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.Order.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          gap: "16px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/orders")}
          style={{
            borderRadius: "8px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Quay lại
        </Button>
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
            Chi tiết đơn hàng #{orderId}
          </Title>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
        </div>
      ) : error ? (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        />
      ) : order ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <OrderInfoCard order={order} />
          <OrderItemsCard orderLines={order.orderLines} />
          <OrderActions />
        </div>
      ) : (
        <Alert
          message="Không tìm thấy đơn hàng!"
          description="Đơn hàng với ID này không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          style={{
            borderRadius: "12px",
            textAlign: "center",
            padding: "40px",
          }}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;