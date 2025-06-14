import { useEffect, useState } from "react"
import { Table, Button, Space, Rate, message, Modal, Form, Input, Switch, Card, Typography, Statistic } from "antd"
import {
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CalendarOutlined,
} from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography
const { TextArea } = Input

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await ApiService.Review.getAllReviews()
      const sortedReviews = (response.data || []).sort((a, b) => {
        if (a.visible !== b.visible) return b.visible ? -1 : 1
        return new Date(b.reviewDate) - new Date(a.reviewDate)
      })
      setReviews(sortedReviews)
    } catch (error) {
      message.error("Không thể tải danh sách đánh giá")
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId) => {
    Modal.confirm({
      title: "Xác nhận xóa đánh giá",
      content: "Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true)
          await ApiService.Review.deleteReview(reviewId)
          message.success("Đánh giá đã được xóa thành công")
          setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId))
        } catch (error) {
          message.error("Không thể xóa đánh giá")
          console.error("Error deleting review:", error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === reviewId ? { ...review, visible: !currentVisibility } : review)),
      )
      await ApiService.Review.toggleVisibility(reviewId)
      message.success(`Đánh giá đã được ${currentVisibility ? "ẩn" : "hiển thị"} thành công`)
    } catch (error) {
      message.error("Không thể thay đổi trạng thái hiển thị")
      console.error("Error toggling visibility:", error)
      fetchReviews()
    }
  }

  const handleEdit = (record) => {
    setEditingReview(record)
    form.setFieldsValue({
      ratingScore: record.ratingScore,
      comment: record.comment,
    })
  }

  const handleUpdate = async (values) => {
    try {
      setLoading(true)
      await ApiService.Review.adminUpdateReview(editingReview.id, {
        ratingScore: values.ratingScore,
        comment: values.comment,
      })
      message.success("Đánh giá đã được cập nhật thành công")
      setEditingReview(null)
      form.resetFields()
      fetchReviews()
    } catch (error) {
      message.error("Không thể cập nhật đánh giá")
      console.error("Error updating review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingReview(null)
    form.resetFields()
  }

  const visibleReviews = reviews.filter((r) => r.visible).length
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.ratingScore, 0) / reviews.length : 0

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
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      fixed: "left",
      render: (productId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            color: "#7c3aed",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          SP #{productId}
        </span>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "userId",
      key: "userId",
      fixed: "left",
      render: (userId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            color: "#92400e",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          User #{userId}
        </span>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "ratingScore",
      key: "ratingScore",
      render: (rating) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Rate disabled value={rating} style={{ fontSize: "16px" }} />
          <span style={{ fontWeight: "600", color: "#f59e0b" }}>({rating})</span>
        </div>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      render: (comment) => (
        <span style={{ color: "#64748b", fontSize: "14px" }}>{comment || "Không có bình luận"}</span>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "reviewDate",
      key: "reviewDate",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: "13px" }}>{new Date(date).toLocaleString("vi-VN")}</span>
        </div>
      ),
      sorter: (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate),
    },
    {
      title: "Hiển thị",
      dataIndex: "visible",
      key: "visible",
      filters: [
        { text: "Hiển thị", value: true },
        { text: "Ẩn", value: false },
      ],
      onFilter: (value, record) => record.visible === value,
      render: (visible, record) => (
        <Switch
          checked={visible}
          onChange={() => handleToggleVisibility(record.id, visible)}
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          disabled={loading}
          style={{
            background: visible ? "#10b981" : "#ef4444",
          }}
        />
      ),
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              color: "#3b82f6",
              borderRadius: "6px",
            }}
            disabled={loading}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{
              borderRadius: "6px",
            }}
            disabled={loading}
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
          <StarOutlined style={{ color: "white", fontSize: "20px" }} />
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
          Quản lý đánh giá khách hàng
        </Title>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
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
            title={<span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>Tổng đánh giá</span>}
            value={reviews.length}
            valueStyle={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}
            prefix={<StarOutlined style={{ color: "#ffffff" }} />}
          />
        </Card>

        <Card
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <Statistic
            title={<span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>Đánh giá hiển thị</span>}
            value={visibleReviews}
            valueStyle={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}
            prefix={<EyeOutlined style={{ color: "#ffffff" }} />}
          />
        </Card>

        <Card
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(245, 158, 11, 0.3)",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <Statistic
            title={<span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>Điểm trung bình</span>}
            value={averageRating.toFixed(1)}
            valueStyle={{ color: "#ffffff", fontSize: "28px", fontWeight: "700" }}
            suffix={<span style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>/5</span>}
          />
        </Card>
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
          dataSource={reviews}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đánh giá`,
          }}
          style={{ borderRadius: "16px", overflow: "hidden" }}
          rowClassName={(record) => (record.visible ? "" : "opacity-60")}
          locale={{
            emptyText: (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <StarOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
                <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Chưa có đánh giá nào từ khách hàng</p>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <EditOutlined style={{ color: "#3b82f6" }} />
            <span>Chỉnh sửa đánh giá</span>
          </div>
        }
        open={!!editingReview}
        onCancel={handleCancel}
        footer={null}
        width={600}
        style={{ borderRadius: "16px" }}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical" style={{ marginTop: "24px" }}>
          <Form.Item
            name="ratingScore"
            label={<span style={{ fontWeight: "600", color: "#1e293b" }}>Điểm đánh giá</span>}
            rules={[{ required: true, message: "Vui lòng chọn điểm đánh giá!" }]}
          >
            <Rate style={{ fontSize: "24px" }} />
          </Form.Item>
          <Form.Item
            name="comment"
            label={<span style={{ fontWeight: "600", color: "#1e293b" }}>Bình luận</span>}
            rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
          >
            <TextArea rows={4} placeholder="Nhập bình luận..." style={{ borderRadius: "8px" }} />
          </Form.Item>
          <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel} style={{ height: "40px", borderRadius: "8px" }}>
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminReviewsPage
