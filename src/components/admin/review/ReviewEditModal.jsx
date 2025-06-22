import { Modal, Form, Button, Rate, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ReviewEditModal = ({ visible, form, onUpdate, onCancel, loading }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <EditOutlined style={{ color: "#3b82f6" }} />
          <span>Chỉnh sửa đánh giá</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      style={{ borderRadius: "16px" }}
    >
      <Form
        form={form}
        onFinish={onUpdate}
        layout="vertical"
        style={{ marginTop: "24px" }}
      >
        <Form.Item
          name="ratingScore"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>
              Điểm đánh giá
            </span>
          }
          rules={[{ required: true, message: "Vui lòng chọn điểm đánh giá!" }]}
        >
          <Rate style={{ fontSize: "24px" }} />
        </Form.Item>
        <Form.Item
          name="comment"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>
              Bình luận
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập bình luận..."
            style={{ borderRadius: "8px" }}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onCancel}
              style={{ height: "40px", borderRadius: "8px" }}
            >
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
  );
};

export default ReviewEditModal;