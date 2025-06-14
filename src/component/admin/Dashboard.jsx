import { useEffect, useState } from "react"
import { Card, Statistic, Table, Spin, Alert, Row, Col, Typography, List } from "antd"
import {
  DollarOutlined,
  UserOutlined,
  TrophyOutlined,
  BarChartOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"

const { Title: AntTitle } = Typography

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  const [topProducts, setTopProducts] = useState([])
  const [allSoldProducts, setAllSoldProducts] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          ApiService.Order.getAllOrders(),
          ApiService.Product.getAllProduct(),
        ])

        const orders = ordersResponse.data || []
        const products = productsResponse.data || []

        const revenue = orders
          .filter((order) => order.status === "PAID")
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
        setTotalRevenue(revenue)

        const uniqueCustomers = new Set(orders.map((order) => order.userId)).size
        setCustomerCount(uniqueCustomers)

        const productQuantities = {}
        const productRevenue = {}
        const productImages = {}
        orders.forEach((order) => {
          if (order.status === "PAID" && order.orderLines) {
            order.orderLines.forEach((line) => {
              const productId = line.productId
              productQuantities[productId] = (productQuantities[productId] || 0) + (line.quantity || 0)
              productRevenue[productId] = (productRevenue[productId] || 0) + (line.price || 0)
              const product = products.find((p) => p.id === Number.parseInt(productId))
              if (product && product.imageUrls && product.imageUrls.length > 0) {
                productImages[productId] = product.imageUrls[0]
              }
            })
          }
        })

        const allSoldProductsData = Object.entries(productQuantities)
          .map(([productId, quantity]) => {
            const product = products.find((p) => p.id === Number.parseInt(productId))
            return {
              productId,
              name: product ? product.name : `Unknown Product (ID: ${productId})`,
              quantity,
              revenue: productRevenue[productId] || 0,
              image: productImages[productId] || null,
            }
          })
          .sort((a, b) => b.quantity - a.quantity)

        setAllSoldProducts(allSoldProductsData)
        setTopProducts(allSoldProductsData.slice(0, 3))
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu thống kê!")
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: "ID",
      dataIndex: "productId",
      key: "id",
      fixed: "left",
      render: (id) => (
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
          #{id}
        </span>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: "500", color: "#1e293b" }}>{text}</span>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image || "/placeholder.svg"}
            alt="Product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
            }}
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              background: "#f1f5f9",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            N/A
          </div>
        ),
    },
    {
      title: "Số lượng bán",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => b.quantity - a.quantity,
      render: (quantity) => (
        <span
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {quantity}
        </span>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      fixed: "right",
      render: (revenue) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {revenue.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
      sorter: (a, b) => b.revenue - a.revenue,
    },
  ]

  const chartLinks = [
    { key: "hourly-orders", title: "Phân tích đơn hàng theo giờ", icon: <BarChartOutlined /> },
    { key: "daily-orders", title: "Phân tích đơn hàng theo ngày", icon: <RiseOutlined /> },
    { key: "hourly-customers", title: "Phân tích khách hàng theo giờ", icon: <TeamOutlined /> },
    { key: "daily-customers", title: "Phân tích khách hàng theo ngày", icon: <UserOutlined /> },
  ]

  const handleChartClick = (key) => {
    navigate(`/admin/dashboard/charts?tab=${key}`)
  }

  return (
    <div style={{ background: "transparent" }}>
      <AntTitle
        level={2}
        style={{
          marginBottom: 32,
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        Chào mừng bạn đến với Bảng điều khiển Quản trị!
      </AntTitle>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
        </div>
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12}>
              <Card
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(5, 150, 105, 0.3)",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>Tổng doanh thu</span>}
                  value={totalRevenue}
                  precision={0}
                  formatter={(value) => `${value.toLocaleString("vi-VN")} VNĐ`}
                  valueStyle={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}
                  prefix={<DollarOutlined style={{ color: "#ffffff" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>Số lượng khách hàng đã mua</span>
                  }
                  value={customerCount}
                  precision={0}
                  valueStyle={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}
                  prefix={<UserOutlined style={{ color: "#ffffff" }} />}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <TrophyOutlined style={{ color: "#f59e0b" }} />
                Sản phẩm bán chạy nhất
              </span>
            }
            style={{
              marginBottom: 32,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Table
              columns={columns}
              dataSource={topProducts}
              rowKey="productId"
              pagination={false}
              locale={{ emptyText: "Chưa có sản phẩm nào được bán." }}
              style={{ borderRadius: "12px", overflow: "hidden" }}
            />
          </Card>

          <Card
            title={
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BarChartOutlined style={{ color: "#3b82f6" }} />
                Tất cả sản phẩm đã bán
              </span>
            }
            style={{
              marginBottom: 32,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Table
              columns={columns}
              dataSource={allSoldProducts}
              rowKey="productId"
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: true,
              }}
              locale={{ emptyText: "Chưa có sản phẩm nào được bán qua đơn hàng PAID." }}
              style={{ borderRadius: "12px", overflow: "hidden" }}
            />
          </Card>

          <Card
            title={
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <RiseOutlined style={{ color: "#8b5cf6" }} />
                Phân tích dữ liệu
              </span>
            }
            style={{
              marginBottom: 32,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <List
              dataSource={chartLinks}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                  onClick={() => handleChartClick(item.key)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "18px", color: "#3b82f6" }}>{item.icon}</span>
                    <Typography.Text
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#1e293b",
                      }}
                    >
                      {item.title}
                    </Typography.Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </>
      )}
    </div>
  )
}

export default Dashboard
