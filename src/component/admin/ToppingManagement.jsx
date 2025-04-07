import React, { useState, useEffect } from "react";
import { Button, Table, Form, Input, Modal, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/toppings.css"; // Optional: Add custom styles

const ToppingManagement = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [form] = Form.useForm();

  // Fetch all toppings on mount
  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllToppings();
      setToppings(response.data || []);
    } catch (error) {
      message.error("Failed to load toppings");
      console.error("Error fetching toppings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding or editing a topping
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingTopping) {
        // Update existing topping
        const response = await ApiService.updateTopping(editingTopping.id, values);
        setToppings(toppings.map((t) => (t.id === editingTopping.id ? response.data : t)));
        message.success("Topping updated successfully");
      } else {
        // Add new topping
        const response = await ApiService.addTopping(values);
        setToppings([...toppings, response.data]);
        message.success("Topping added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTopping(null);
    } catch (error) {
      message.error(`Failed to ${editingTopping ? "update" : "add"} topping`);
      console.error("Error saving topping:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a topping
  const handleDelete = async (toppingId) => {
    setLoading(true);
    try {
      await ApiService.deleteTopping(toppingId);
      setToppings(toppings.filter((t) => t.id !== toppingId));
      message.success("Topping deleted successfully");
    } catch (error) {
      message.error("Failed to delete topping");
      console.error("Error deleting topping:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding/editing
  const showModal = (topping = null) => {
    setEditingTopping(topping);
    if (topping) {
      form.setFieldsValue(topping);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="topping-header">
        <h2>Topping Management</h2>
        <Button type="primary" onClick={() => showModal()}>
            Add Topping
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={toppings}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingTopping ? "Edit Topping" : "Add Topping"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the topping name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter the price" },
              { type: "number", min: 0, message: "Price must be non-negative" },
            ]}
            normalize={(value) => (value ? Number(value) : value)}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingTopping ? "Update" : "Add"}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ToppingManagement;