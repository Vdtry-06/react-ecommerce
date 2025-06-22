import { useState, useEffect } from "react";
import { Card, Spin, Alert } from "antd";
import OrdersHeader from "../../../components/admin/order/OrderHeader";
import OrdersTable from "../../../components/admin/order/OrderTable";
import ApiService from "../../../service/ApiService";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ padding: "24px" }}>
      <OrdersHeader />
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" tip="Đang tải danh sách đơn hàng..." />
        </div>
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : (
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <OrdersTable orders={orders} />
        </Card>
      )}
    </div>
  );
};

export default AdminOrdersPage;