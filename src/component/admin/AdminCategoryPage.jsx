import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Form, Input, Modal, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/adminCategoryPage.css";
// import "../../static/style/adminPage.css";

const AdminCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      message.error("Failed to load categories");
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const response = await ApiService.updateCategory(editingCategory.id, values);
        setCategories(categories.map((c) => (c.id === editingCategory.id ? response.data : c)));
        message.success("Category updated successfully");
      } else {
        const response = await ApiService.addCategory(values);
        setCategories([...categories, response.data]);
        message.success("Category added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error(`Failed to ${editingCategory ? "update" : "add"} category`);
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone.",
      onOk: async () => {
        setLoading(true);
        try {
          await ApiService.deleteCategory(categoryId);
          setCategories(categories.filter((c) => c.id !== categoryId));
          message.success("Category deleted successfully");
        } catch (error) {
          message.error("Cannot delete: This category may be linked to existing products.");
          console.error("Error deleting category:", error);
        } finally {
          setLoading(false);
        }
      },
    });
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

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
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
    <div className="admin-category-list">
      <div className="category-header">
        <h2>Category Management</h2>
        <Button type="primary" onClick={() => showModal()}>
          Add Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "No categories found. Add a category to get started!" }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCategory ? "Update" : "Add"}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategoryPage;