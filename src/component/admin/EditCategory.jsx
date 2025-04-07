import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryId) fetchCategory(categoryId);
  }, [categoryId]);

  const fetchCategory = async (id) => {
    setLoading(true);
    try {
      const response = await ApiService.getCategory(id);
      form.setFieldsValue(response.data || {});
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to get category");
      console.error("Error fetching category:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await ApiService.updateCategory(categoryId, values);
      if (response.data && response.data.id) {
        message.success("Category updated successfully");
        navigate("/admin/categories");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update category");
      console.error("Error updating category:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-category-list">
      <div className="category-header">
        <h2>Edit Category</h2>
        <Button onClick={() => navigate("/admin/categories")}>
          Back
        </Button>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="category-form"
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter the category name" }]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate("/admin/categories")}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategory;