import React from "react";
import { Tabs, Avatar, Rate, Button, Space, Popconfirm, Form, Input, Typography  } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
const { Paragraph, Title } = Typography;

const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductTabs = ({
  activeTab,
  setActiveTab,
  comments,
  userId,
  editingComment,
  setEditingComment,
  form,
  userRating,
  setUserRating,
  hasCommented,
  isProcessing,
  handleReviewSubmit,
  handleUpdateComment,
  handleDeleteComment,
  product,
}) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
        <TabPane tab="MÔ TẢ" key="description">
          <Title level={4}>TRẢI NGHIỆM ẨM THỰC ĐỈNH CAO</Title>
          <Paragraph>{product.description}</Paragraph>
        </TabPane>
        <TabPane tab={`BÌNH LUẬN (${comments.length})`} key="comment">
          <div className="comments">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{ display: "flex", gap: "15px", padding: "15px 0", borderBottom: "1px solid #eee" }}
                >
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#007bff" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "16px", color: "#333" }}>{`Người dùng ${comment.userId}`}</strong>
                      <span style={{ color: "#999", fontSize: "12px" }}>
                        {new Date(comment.reviewDate).toLocaleString()}
                      </span>
                    </div>
                    <Rate disabled value={comment.ratingScore} style={{ margin: "5px 0" }} />
                    <p style={{ color: "#666", lineHeight: "1.5" }}>{comment.comment}</p>
                    {userId === comment.userId && !editingComment && (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingComment(comment);
                            form.setFieldsValue({ rating: comment.ratingScore, comment: comment.comment });
                            setActiveTab("edit-comment");
                          }}
                        >
                          Sửa
                        </Button>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa bình luận này?"
                          onConfirm={() => handleDeleteComment(comment.id)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                        </Popconfirm>
                      </Space>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#999", fontStyle: "italic" }}>Chưa có bình luận nào.</p>
            )}
          </div>
        </TabPane>
        {!hasCommented && (
          <TabPane tab="ĐĂNG BÌNH LUẬN" key="post-comment">
            <div style={{ maxWidth: "600px" }}>
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ color: "#333" }}>Đánh giá:</strong>
                <Rate value={userRating} onChange={setUserRating} style={{ marginLeft: "8px" }} />
              </div>
              <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                  Chia sẻ ý kiến của bạn:
                </h3>
                <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}>
                  <Rate onChange={setUserRating} value={userRating} />
                </Form.Item>
                <Form.Item name="comment" label="Bình luận" rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}>
                  <TextArea rows={6} placeholder="Viết bình luận..." />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isProcessing}
                    style={{ background: "#007bff", borderColor: "#007bff" }}
                  >
                    {isProcessing ? "Đang xử lý..." : "Gửi bình luận"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        )}
        {editingComment && (
          <TabPane tab="SỬA BÌNH LUẬN" key="edit-comment">
            <div style={{ maxWidth: "600px" }}>
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ color: "#333" }}>Đánh giá:</strong>
                <Rate value={userRating} onChange={setUserRating} style={{ marginLeft: "8px" }} />
              </div>
              <Form
                form={form}
                onFinish={(values) => handleUpdateComment(editingComment.id, values)}
                layout="vertical"
              >
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                  Sửa bình luận:
                </h3>
                <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}>
                  <Rate onChange={setUserRating} value={userRating} />
                </Form.Item>
                <Form.Item name="comment" label="Bình luận" rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}>
                  <TextArea rows={6} placeholder="Viết bình luận..." />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isProcessing}
                    style={{ background: "#007bff", borderColor: "#007bff" }}
                  >
                    {isProcessing ? "Đang xử lý..." : "Cập nhật bình luận"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingComment(null);
                      form.resetFields();
                      setActiveTab("comment");
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ProductTabs;