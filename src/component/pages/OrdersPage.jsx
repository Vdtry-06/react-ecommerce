import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Spin, Alert, Table, Typography, Button, Avatar, Space } from "antd";
import "../../static/style/orders.css";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const response = await ApiService.Order.getAllOrdersOfUser(userId);

      const paidOrders = response.data.filter(order => order.status === "PAID");
      const enrichedOrders = await Promise.all(
        paidOrders.map(async (order) => {
          const enrichedOrderLines = await Promise.all(
            order.orderLines.map(async (line) => {
              try {
                const productResponse = await ApiService.Product.getProduct(line.productId);
                return {
                  ...line,
                  productName: productResponse.data.name || `Sản phẩm #${line.productId}`,
                  imageUrl: productResponse.data.imageUrls[0] || null,
                };
              } catch (err) {
                console.warn(`Failed to fetch product ${line.productId}:`, err);
                return {
                  ...line,
                  productName: `Sản phẩm #${line.productId}`,
                  imageUrl: null,
                };
              }
            })
          );
          return { ...order, orderLines: enrichedOrderLines };
        })
      );

      setOrders(enrichedOrders);
    } catch (err) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại!");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (_, order) => (
        <Space direction="vertical" size="small">
          {order.orderLines.map((line) => (
            <Space key={line.id}>
              {line.imageUrl ? (
                <Avatar src={line.imageUrl} size={40} shape="square" />
              ) : (
                <Avatar size={40} shape="square">N/A</Avatar>
              )}
              <Text>
                {line.productName} (Số lượng: {line.quantity})
              </Text>
            </Space>
          ))}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text className={status.toLowerCase()}>{status}</Text>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => `${totalPrice.toFixed(2)} VNĐ`,
    },
    {
      title: "Thời gian thanh toán",
      dataIndex: "createdDate",
      key: "createdDate",
       render: (date) => new Date(date).toLocaleString("vi-VN"),
    }
  ];

  if (loading) {
    return (
      <div className="orders-page">
        <Spin tip="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <Text>Bạn chưa có đơn hàng nào đã thanh toán.</Text>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Title level={2}>Đơn hàng đã mua</Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          pageSize: 4,
          pageSizeOptions: ["4", "8", "16"],
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
        }}
        scroll={{ x: true }}
      />
      <Button
        type="primary"
        onClick={() => navigate("/")}
        style={{ marginTop: 16 }}
      >
        Quay lại trang chủ
      </Button>
    </div>
  );
};

export default OrdersPage;