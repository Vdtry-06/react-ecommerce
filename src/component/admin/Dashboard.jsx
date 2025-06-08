import React, { useEffect, useState } from 'react';
import {
  Card,
  Statistic,
  Table,
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  List,
} from "antd";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const { Title: AntTitle } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [allSoldProducts, setAllSoldProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          ApiService.Order.getAllOrders(),
          ApiService.Product.getAllProduct(),
        ]);

        const orders = ordersResponse.data || [];
        const products = productsResponse.data || [];

        const revenue = orders
          .filter((order) => order.status === "PAID")
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        setTotalRevenue(revenue);

        const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;
        setCustomerCount(uniqueCustomers);

        const productQuantities = {};
        const productRevenue = {};
        const productImages = {};
        orders.forEach((order) => {
          if (order.status === "PAID" && order.orderLines) {
            order.orderLines.forEach((line) => {
              const productId = line.productId;
              productQuantities[productId] =
                (productQuantities[productId] || 0) + (line.quantity || 0);
              productRevenue[productId] =
                (productRevenue[productId] || 0) + (line.price || 0);
              const product = products.find((p) => p.id === parseInt(productId));
              if (product && product.imageUrls && product.imageUrls.length > 0) {
                productImages[productId] = product.imageUrls[0];
              }
            });
          }
        });

        const allSoldProductsData = Object.entries(productQuantities)
          .map(([productId, quantity]) => {
            const product = products.find((p) => p.id === parseInt(productId));
            return {
              productId,
              name: product
                ? product.name
                : `Unknown Product (ID: ${productId})`,
              quantity,
              revenue: productRevenue[productId] || 0,
              image: productImages[productId] || null,
            };
          })
          .sort((a, b) => b.quantity - a.quantity);

        setAllSoldProducts(allSoldProductsData);
        setTopProducts(allSoldProductsData.slice(0, 3));
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu thống kê!");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng bán",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => b.quantity - a.quantity,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => `${revenue.toLocaleString("vi-VN")} VNĐ`,
      sorter: (a, b) => b.revenue - a.revenue,
    },
  ];

  const chartLinks = [
    { key: "hourly-orders", title: "Phân tích đơn hàng theo giờ" },
    { key: "daily-orders", title: "Phân tích đơn hàng theo ngày" },
    { key: "hourly-customers", title: "Phân tích khách hàng theo giờ" },
    { key: "daily-customers", title: "Phân tích khách hàng theo ngày" },
  ];

  const handleChartClick = (key) => {
    navigate(`/admin/dashboard/charts?tab=${key}`);
  };

  return (
    <div>
      <AntTitle level={2} style={{ marginBottom: 24 }}>
        Chào mừng bạn đến với Bảng điều khiển Quản trị!
      </AntTitle>

      {loading ? (
        <Spin tip="Đang tải dữ liệu thống kê..." />
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={totalRevenue}
                  precision={0}
                  formatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
                  style={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Số lượng khách hàng đã mua"
                  value={customerCount}
                  precision={0}
                  style={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Sản phẩm bán chạy nhất" style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={topProducts}
              rowKey="productId"
              pagination={false}
              locale={{ emptyText: "Chưa có sản phẩm nào được bán." }}
            />
          </Card>

          <Card title="Tất cả sản phẩm đã bán" style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={allSoldProducts}
              rowKey="productId"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: "Chưa có sản phẩm nào được bán qua đơn hàng PAID." }}
            />
          </Card>

          <Card title="Phân tích dữ liệu" style={{ marginBottom: 24 }}>
            <List
              dataSource={chartLinks}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Link
                    onClick={() => handleChartClick(item.key)}
                    style={{ fontSize: 16 }}
                  >
                    {item.title}
                  </Typography.Link>
                </List.Item>
              )}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;