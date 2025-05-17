import { useEffect, useState } from "react";
import { Table, Button, Space, Rate, message, Modal, Form, Input, Switch, Popconfirm } from "antd";
import { CircleCheckIcon as CheckCircleOutlined, CircleOffIcon as CloseCircleOutlined } from "lucide-react";
import ApiService from "../../service/ApiService";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Review.getAllReviews();
      const sortedReviews = (response.data || []).sort((a, b) => {
        if (a.visible !== b.visible) return b.visible ? -1 : 1;
        return new Date(b.reviewDate) - new Date(a.reviewDate);
      });
      setReviews(sortedReviews);
    } catch (error) {
      message.error("Failed to load reviews");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      setLoading(true);
      await ApiService.Review.deleteReview(reviewId);
      message.success("Review deleted successfully");
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      message.error("Failed to delete review");
      console.error("Error deleting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      // Optimistically update the UI
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, visible: !currentVisibility } : review
        )
      );
      await ApiService.Review.toggleVisibility(reviewId);
      message.success(`Review ${currentVisibility ? "hidden" : "shown"} successfully`);
    } catch (error) {
      message.error("Failed to toggle visibility");
      console.error("Error toggling visibility:", error);
      // Revert on error
      fetchReviews();
    }
  };

  const handleEdit = (record) => {
    setEditingReview(record);
    form.setFieldsValue({
      ratingScore: record.ratingScore,
      comment: record.comment,
    });
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await ApiService.Review.adminUpdateReview(editingReview.id, {
        ratingScore: values.ratingScore,
        comment: values.comment,
      });
      message.success("Review updated successfully");
      setEditingReview(null);
      form.resetFields();
      fetchReviews();
    } catch (error) {
      message.error("Failed to update review");
      console.error("Error updating review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingReview(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Review ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      width: 100,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
    },
    {
      title: "Rating",
      dataIndex: "ratingScore",
      key: "ratingScore",
      width: 150,
      render: (rating) => <Rate disabled value={rating} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: "Review Date",
      dataIndex: "reviewDate",
      key: "reviewDate",
      width: 150,
      render: (date) => new Date(date).toLocaleString("vi-VN"),
      sorter: (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate),
    },
    {
      title: "Visible",
      dataIndex: "visible",
      key: "visible",
      width: 120,
      filters: [
        { text: "Visible", value: true },
        { text: "Hidden", value: false },
      ],
      onFilter: (value, record) => record.visible === value,
      render: (visible, record) => (
        <Switch
          checked={visible}
          onChange={() => handleToggleVisibility(record.id, visible)}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<CloseCircleOutlined />}
          disabled={loading}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ borderRadius: "5px" }}
            disabled={loading}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={loading}
          >
            <Button type="primary" danger style={{ borderRadius: "5px" }} disabled={loading}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" }}>Manage Reviews</h2>

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Button
            type="primary"
            onClick={fetchReviews}
            style={{ borderRadius: "5px", marginRight: 10 }}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
        <div>
          <span style={{ marginRight: 10 }}>
            Total Reviews: <strong>{reviews.length}</strong>
          </span>
          <span>
            Visible Reviews: <strong>{reviews.filter((r) => r.visible).length}</strong>
          </span>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reviews`,
        }}
        style={{ background: "#fff", borderRadius: "8px" }}
        rowClassName={(record) => (record.visible ? "table-row-light" : "table-row-dark")}
      />

      <Modal
        title="Edit Review"
        open={!!editingReview}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ style: { background: "#1890ff", borderColor: "#1890ff", borderRadius: "5px" }, disabled: loading }}
        cancelButtonProps={{ style: { borderRadius: "5px" }, disabled: loading }}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical" style={{ padding: "10px 0" }}>
          <Form.Item
            name="ratingScore"
            label="Rating"
            rules={[{ required: true, message: "Please input the rating!" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please input the comment!" }]}
          >
            <Input.TextArea rows={4} style={{ borderRadius: "5px" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminReviewsPage;