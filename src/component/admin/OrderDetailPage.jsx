import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Descriptions, Table, Button, Spin, Alert, Typography, Tag } from "antd"
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await ApiService.Order.getOrderById(orderId)
        setOrder(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải chi tiết đơn hàng!")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "#f59e0b",
      PAID: "#10b981",
      CANCELLED: "#ef4444",
      PROCESSING: "#3b82f6",
      DELIVERED: "#059669",
    }
    return statusColors[status] || "#64748b"
  }

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: "Chờ xử lý",
      PAID: "Đã thanh toán",
      CANCELLED: "Đã hủy",
      PROCESSING: "Đang xử lý",
      DELIVERED: "Đã giao",
    }
    return statusTexts[status] || status
  }

  const orderLineColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      width: 120,
      render: (productId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            color: "#7c3aed",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          SP #{productId}
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "4px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {quantity}
        </span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {price.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_, record) => (
        <span
          style={{
            color: "#dc2626",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {(record.price * record.quantity).toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
  ]

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
          {/* Order Information Card */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ShoppingCartOutlined style={{ color: "#3b82f6" }} />
                <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin đơn hàng</span>
              </div>
            }
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Mã đơn hàng" span={1}>
                <span
                  style={{
                    background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                    color: "#0369a1",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  #{order.id}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={1}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <UserOutlined style={{ color: "#64748b" }} />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                      color: "#92400e",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    User #{order.userId}
                  </span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                <Tag
                  color={getStatusColor(order.status)}
                  style={{
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: "none",
                  }}
                >
                  {getStatusText(order.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={1}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <DollarOutlined style={{ color: "#059669" }} />
                  <span
                    style={{
                      color: "#059669",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                  >
                    {order.totalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CalendarOutlined style={{ color: "#64748b" }} />
                  <span style={{ color: "#64748b" }}>{new Date(order.createdDate).toLocaleString("vi-VN")}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối" span={1}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CalendarOutlined style={{ color: "#64748b" }} />
                  <span style={{ color: "#64748b" }}>{new Date(order.lastModifiedDate).toLocaleString("vi-VN")}</span>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Order Items Card */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ShoppingOutlined style={{ color: "#3b82f6" }} />
                <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                  Chi tiết sản phẩm ({order.orderLines?.length || 0} sản phẩm)
                </span>
              </div>
            }
            style={{
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Table
              columns={orderLineColumns}
              dataSource={order.orderLines}
              rowKey="id"
              pagination={false}
              locale={{
                emptyText: (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <ShoppingOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
                    <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Đơn hàng không có sản phẩm nào</p>
                  </div>
                ),
              }}
              style={{ borderRadius: "12px", overflow: "hidden" }}
              summary={(pageData) => {
                const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0)
                const totalAmount = pageData.reduce((sum, record) => sum + record.price * record.quantity, 0)

                return (
                  <Table.Summary.Row
                    style={{
                      background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                      fontWeight: "600",
                    }}
                  >
                    <Table.Summary.Cell index={0}>
                      <span style={{ fontWeight: "700", color: "#1e293b" }}>Tổng cộng</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {totalQuantity}
                      </span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <span
                        style={{
                          color: "#dc2626",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {totalAmount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
          </Card>

          {/* Action Buttons */}
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
  )
}

export default OrderDetailPage
