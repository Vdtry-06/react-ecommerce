import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Form,
  Input,
  Modal,
  message,
  Typography,
  Space,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import ApiService from "../../../service/ApiService";

const { Title } = Typography;
const { TextArea } = Input;

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Category.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục");
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setIsModalVisible(false);
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

  const handleDelete = async (categoryId) => {
    console.log("Deleting category with ID:", categoryId);
    setCategoryToDelete(categoryId);
    setIsDeleteModalVisible(true);
  };

  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  

  const handleDeleteOk = async () => {
    console.log("Confirmed deletion for category ID:", categoryToDelete);
    setLoading(true);
    try {
      await ApiService.Category.deleteCategory(categoryToDelete);
      setCategories(categories.filter((c) => c.id !== categoryToDelete));
      message.success("Danh mục đã được xóa thành công");
    } catch (error) {
      message.error("Không thể xóa: Danh mục này có thể đang được liên kết với sản phẩm.");
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  }

  const handleDeleteCancel = () => {
    console.log("Modal cancelled");
    setIsDeleteModalVisible(false);
    setCategoryToDelete(null);
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (name) => (
        <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>
          {name}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span style={{ color: "#64748b" }}>{text || "Không có mô tả"}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        console.log("Record:", record.id);
        return (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              style={{
                color: "#3b82f6",
                borderRadius: "6px",
              }}
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
            >
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginTop: -20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
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
            <AppstoreOutlined style={{ color: "white", fontSize: "20px" }} />
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
            Quản lý danh mục
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
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
          Thêm danh mục
        </Button>
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
          dataSource={categories}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`,
          }}
          locale={{
            emptyText: "Chưa có danh mục nào. Thêm danh mục để bắt đầu!",
          }}
          style={{ borderRadius: "16px", overflow: "hidden" }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AppstoreOutlined style={{ color: "#3b82f6" }} />
            <span>
              {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        style={{ borderRadius: "16px" }}
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
                onClick={() => setIsModalVisible(false)}
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
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa danh mục"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
      </Modal>
    </div>
  );
};

export default AdminCategoryPage;