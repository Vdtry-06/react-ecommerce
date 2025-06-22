import { Modal, Form, Input, Button, message } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import ApiService from "../../../service/ApiService";

const { TextArea } = Input;

const CategoryFormModal = ({
  visible,
  onCancel,
  editingCategory,
  setCategories,
  categories,
  setLoading,
  setEditingCategory,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const response = await ApiService.Category.updateCategory(
          editingCategory.id,
          values
        );
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? response.data : c
          )
        );
        message.success("Danh mục đã được cập nhật thành công");
      } else {
        const response = await ApiService.Category.addCategory(values);
        setCategories([...categories, response.data]);
        message.success("Danh mục đã được thêm thành công");
      }
      onCancel();
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error(
        `Không thể ${editingCategory ? "cập nhật" : "thêm"} danh mục`
      );
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AppstoreOutlined style={{ color: "#3b82f6" }} />
          <span>
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      style={{ borderRadius: "16px" }}
      afterOpenChange={(open) => {
        if (open && editingCategory) {
          form.setFieldsValue(editingCategory);
        } else {
          form.resetFields();
        }
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginTop: "24px" }}
      >
        <Form.Item
          name="name"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>
              Tên danh mục
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input
            placeholder="Nhập tên danh mục..."
            style={{ height: "48px", borderRadius: "8px" }}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={
            <span style={{ fontWeight: "600", color: "#1e293b" }}>Mô tả</span>
          }
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả danh mục..."
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
              loading={false}
              style={{
                height: "40px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                border: "none",
                fontWeight: "600",
              }}
            >
              {editingCategory ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;