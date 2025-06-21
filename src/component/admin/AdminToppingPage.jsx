import { useState, useEffect } from "react";
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
  PlusCircleOutlined,
} from "@ant-design/icons";
import ApiService from "../../service/ApiService";

const { Title } = Typography;

const ToppingManagement = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Topping.getAllToppings();
      setToppings(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách toppings");
      console.error("Error fetching toppings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingTopping) {
        const response = await ApiService.Topping.updateTopping(
          editingTopping.id,
          values
        );
        setToppings(
          toppings.map((t) => (t.id === editingTopping.id ? response.data : t))
        );
        message.success("Topping đã được cập nhật thành công");
      } else {
        const response = await ApiService.Topping.addTopping(values);
        setToppings([...toppings, response.data]);
        message.success("Topping đã được thêm thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTopping(null);
    } catch (error) {
      message.error(
        `Không thể ${editingTopping ? "cập nhật" : "thêm"} topping`
      );
      console.error("Error saving topping:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toppingId) => {
    setIsDeleteModalVisible(true);
    setEditingTopping(toppingId);
  }

  const handelDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Topping.deleteTopping(editingTopping);
      setToppings(toppings.filter((t) => t.id !== editingTopping));
      message.success("Topping đã được xóa thành công");
    } catch (error) {
      message.error("Không thể xóa topping");
      console.error("Error deleting topping:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setEditingTopping(null);
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setEditingTopping(null);
  };

  const showModal = (topping = null) => {
    setEditingTopping(topping);
    if (topping) {
      form.setFieldsValue(topping);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

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
      title: "Tên topping",
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
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
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => (
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
      ),
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
            <PlusCircleOutlined style={{ color: "white", fontSize: "20px" }} />
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
            Quản lý Toppings
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
          Thêm topping
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
          dataSource={toppings}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} toppings`,
          }}
          locale={{
            emptyText: "Chưa có topping nào. Thêm topping để bắt đầu!",
          }}
          style={{ borderRadius: "16px", overflow: "hidden" }}
        />
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PlusCircleOutlined style={{ color: "#3b82f6" }} />
            <span>
              {editingTopping ? "Chỉnh sửa topping" : "Thêm topping mới"}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={500}
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
                {editingTopping ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa Topping"
        open={isDeleteModalVisible}
        onOk={handelDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc chắn muốn xóa Topping này? Hành động này không thể hoàn tác.
      </Modal>
    </div>
  );
};

export default ToppingManagement;
