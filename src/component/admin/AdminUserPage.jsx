import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Table, Button, Modal, message, Card, Typography, Space, Avatar } from "antd"
import { UserOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography

const AdminUserPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await ApiService.User.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải danh sách người dùng")
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: "Xác nhận xóa người dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        setLoading(true)
        try {
          await ApiService.User.deleteUser(userId)
          setUsers(users.filter((user) => user.id !== userId))
          message.success("Người dùng đã được xóa thành công")
        } catch (error) {
          message.error(error.response?.data?.message || "Không thể xóa người dùng")
          console.error("Error deleting user:", error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      fixed: "left",
      render: (username) => <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{username}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url, record) =>
        url ? (
          <Avatar
            src={url}
            size={48}
            style={{
              border: "2px solid #e2e8f0",
            }}
          />
        ) : (
          <Avatar
            icon={<UserOutlined />}
            size={48}
            style={{
              backgroundColor: "#3b82f6",
              border: "2px solid #e2e8f0",
            }}
          />
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span style={{ color: "#64748b" }}>{email}</span>,
    },
    {
      title: "Họ tên",
      key: "fullName",
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(" ")
        return <span style={{ color: "#64748b" }}>{fullName || "Chưa cập nhật"}</span>
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => <span style={{ color: "#64748b" }}>{date || "Chưa cập nhật"}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/user-detail/${record.id}`)}
            style={{
              color: "#3b82f6",
              borderRadius: "6px",
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
            style={{
              borderRadius: "6px",
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: "24px" }}>
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
          Quản lý người dùng
        </Title>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          locale={{ emptyText: "Chưa có người dùng nào." }}
          style={{ borderRadius: "16px", overflow: "hidden" }}
        />
      </Card>
    </div>
  )
}

export default AdminUserPage
