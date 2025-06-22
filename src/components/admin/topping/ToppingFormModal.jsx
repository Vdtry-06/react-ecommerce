import { Modal, Form, Input, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const ToppingFormModal = ({ visible, form, onSubmit, onCancel, editingTopping, loading }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PlusCircleOutlined style={{ color: "#3b82f6" }} />
          <span>{editingTopping ? "Chỉnh sửa topping" : "Thêm topping mới"}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      style={{ borderRadius: "16px" }}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        style={{ marginTop: "24px" }}
      >
        <Form.Item
          name="name"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>
              Tên topping
            </span>
          }
          rules={[
            { required: true, message: "Vui lòng nhập tên topping" },
            { min: 2, message: "Tên topping phải có ít nhất 2 ký tự" },
          ]}
        >
          <Input
            placeholder="Nhập tên topping..."
            style={{ height: "48px", borderRadius: "8px" }}
          />
        </Form.Item>
        <Form.Item
          name="price"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>
              Giá (VNĐ)
            </span>
          }
          rules={[
            { required: true, message: "Vui lòng nhập giá topping" },
            {
              type: "number",
              min: 0,
              message: "Giá phải lớn hơn hoặc bằng 0",
            },
          ]}
          normalize={(value) => (value ? Number(value) : value)}
        >
          <Input
            type="number"
            step="1"
            placeholder="Nhập giá topping..."
            style={{ height: "48px", borderRadius: "8px" }}
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
              {editingTopping ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToppingFormModal;