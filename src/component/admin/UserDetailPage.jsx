import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Descriptions, Table, Button, Spin, message, Card, Typography, Avatar, Tag } from "antd"
import {
  ArrowLeftOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography

const UserDetailPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserInfo(userId)
  }, [userId])

  const fetchUserInfo = async (id) => {
    setLoading(true)
    try {
      const response = await ApiService.User.getUserInfoById(id)
      console.log("User info response:", response)
      setUser(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải thông tin người dùng")
      console.error("Error fetching user info:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
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
      title: "Ngày đặt",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      width: 150,
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            {text ? new Date(text).toLocaleString("vi-VN") : "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {price !== undefined ? `${price.toLocaleString("vi-VN")} VNĐ` : "-"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: "8px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: "600",
            border: "none",
          }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
  ]

  if (!user && !loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#64748b", fontSize: "16px" }}>Không thể tải thông tin người dùng.</p>
        <Button type="primary" onClick={() => navigate("/admin/users")}>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

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
          onClick={() => navigate("/admin/users")}
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
            <UserOutlined style={{ color: "white", fontSize: "20px" }} />
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
            Chi tiết người dùng: {user?.username || "Đang tải..."}
          </Title>
        </div>
      </div>

      <Spin spinning={loading}>
        {user && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid #e2e8f0",
              }}
              bodyStyle={{ padding: "32px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
                {user.imageUrl ? (
                  <Avatar
                    src={user.imageUrl}
                    size={80}
                    style={{
                      border: "4px solid #e2e8f0",
                    }}
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    size={80}
                    style={{
                      backgroundColor: "#3b82f6",
                      border: "4px solid #e2e8f0",
                    }}
                  />
                )}
                <div>
                  {/* <Title level={3} style={{ margin: 0, color: "#1e293b" }}>
                    {user.username}
                  </Title> */}
                  <p style={{ color: "#64748b", fontSize: "16px", margin: "4px 0" }}>{user.username}</p>
                  <p style={{ color: "#64748b", fontSize: "16px", margin: "4px 0" }}>{user.email}</p>
                  {user.role && (
                    <Tag
                      style={{
                        background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                        color: "#7c3aed",
                        border: "none",
                        borderRadius: "8px",
                        padding: "4px 12px",
                        fontWeight: "600",
                      }}
                    >
                      {user.role.name}
                    </Tag>
                  )}
                </div>
              </div>

              <Descriptions
                title={<span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin cơ bản</span>}
                bordered
                column={2}
                size="middle"
              >
                <Descriptions.Item label="ID" span={1}>
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
                    #{user.id}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Tên đăng nhập" span={1}>
                  {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={1}>
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh" span={1}>
                  {user.dateOfBirth || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Tên" span={1}>
                  {user.firstName || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Họ" span={1}>
                  {user.lastName || "Chưa cập nhật"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <HomeOutlined style={{ color: "#3b82f6" }} />
                  <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>Thông tin địa chỉ</span>
                </div>
              }
              style={{
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid #e2e8f0",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              {user.address ? (
                <Descriptions bordered column={2} size="middle">
                  <Descriptions.Item label="Số nhà" span={1}>
                    {user.address.houseNumber || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Đường" span={1}>
                    {user.address.street || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phường/Xã" span={1}>
                    {user.address.ward || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quận/Huyện" span={1}>
                    {user.address.district || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thành phố" span={1}>
                    {user.address.city || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quốc gia" span={1}>
                    {user.address.country || "Chưa cập nhật"}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                    borderRadius: "12px",
                  }}
                >
                  <HomeOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
                  <p style={{ fontSize: "16px", margin: 0 }}>Người dùng chưa cập nhật thông tin địa chỉ</p>
                </div>
              )}
            </Card>

            {/* Orders History Card */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <ShoppingCartOutlined style={{ color: "#3b82f6" }} />
                  <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
                    Lịch sử đơn hàng ({user.orders?.length || 0})
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
                columns={orderColumns}
                dataSource={user.orders || []}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                }}
                locale={{
                  emptyText: (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <ShoppingCartOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
                      <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Người dùng chưa có đơn hàng nào</p>
                    </div>
                  ),
                }}
                style={{ borderRadius: "12px", overflow: "hidden" }}
              />
            </Card>
          </div>
        )}
      </Spin>
    </div>
  )
}

export default UserDetailPage
