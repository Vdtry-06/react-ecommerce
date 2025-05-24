import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Table, Button, Spin, Alert, Typography } from "antd";
import ApiService from "../../service/ApiService";

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

  const orderLineColumns = [
    {
      title: "ID sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Toppings",
    //   dataIndex: "selectedToppings",
    //   key: "selectedToppings",
    //   render: (toppings) => {
    //     if (!toppings || toppings.length === 0) return "-";
    //     return toppings.map((topping) => `${topping.name} (${topping.price.toLocaleString()} VNĐ)`).join(", ");
    //   },
    // },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chi tiết đơn hàng #{orderId}</h2>
      {loading ? (
        <Spin tip="Đang tải chi tiết đơn hàng..." />
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : order ? (
        <Card>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã đơn hàng">{order.id}</Descriptions.Item>
            <Descriptions.Item label="ID người dùng">{order.userId}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{order.status}</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {order.totalPrice.toLocaleString()} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(order.createdDate).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật cuối">
              {new Date(order.lastModifiedDate).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
          <Title level={4} style={{ marginTop: "20px" }}>
            Chi tiết sản phẩm
          </Title>
          <Table
            columns={orderLineColumns}
            dataSource={order.orderLines}
            rowKey="id"
            pagination={false}
          />
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/admin/orders")}
          >
            Quay lại danh sách đơn hàng
          </Button>
        </Card>
      ) : (
        <Alert message="Không tìm thấy đơn hàng!" type="warning" showIcon />
      )}
    </div>
  );
};

export default OrderDetailPage;