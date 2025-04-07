import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, Checkbox, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ApiService from "../../service/ApiService";
import "../../static/style/adminProductPage.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchProduct(productId);
    fetchAllCategories();
    fetchAllToppings();
  }, [productId]);

  const fetchProduct = async (id) => {
    setLoading(true);
    try {
      const response = await ApiService.getProduct(id);
      const productData = response.data;
      form.setFieldsValue({
        name: productData.name || "",
        description: productData.description || "",
        availableQuantity: productData.availableQuantity || "",
        price: productData.price || "",
        categoryNames: productData.categories?.map((cat) => cat.name) || [],
        toppingNames: productData.toppings?.map((top) => top.name) || [],
      });
      setImagePreview(productData.imageUrl || null);
      if (productData.imageUrl) {
        setFileList([{ uid: "-1", name: "image", status: "done", url: productData.imageUrl }]);
      }
    } catch (error) {
      message.error("Failed to load product data");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await ApiService.getAllCategories();
      setAllCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching all categories:", error);
    }
  };

  const fetchAllToppings = async () => {
    try {
      const response = await ApiService.getAllToppings();
      setAllToppings(response.data || []);
    } catch (error) {
      console.error("Error fetching all toppings:", error);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setImagePreview(URL.createObjectURL(newFileList[0].originFileObj));
    } else if (newFileList.length === 0) {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("availableQuantity", values.availableQuantity);
      formData.append("price", values.price);
      (values.categoryNames || []).forEach((name) => formData.append("categoryNames", name));
      (values.toppingNames || []).forEach((name) => formData.append("toppingNames", name));
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      const response = await ApiService.updateProduct(productId, formData);
      if (response.status === 200) {
        message.success("Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 1000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update product");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onChange: handleImageChange,
    fileList,
    beforeUpload: () => false,
    maxCount: 1,
    listType: "picture",
  };

  return (
    <div className="admin-product-list">
      <h2>Thay đổi sản phẩm</h2>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="product-form"
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item
            name="availableQuantity"
            label="Số lượng có sẵn"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { type: "number", min: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" },
            ]}
            normalize={(value) => (value ? Number(value) : value)}
          >
            <Input type="number" placeholder="Available Quantity" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
            ]}
            normalize={(value) => (value ? Number(value) : value)}
          >
            <Input type="number" step="0.01" placeholder="Price" />
          </Form.Item>

          <Form.Item name="categoryNames" label="Danh mục">
            <Checkbox.Group>
              {allCategories.map((cat) => (
                <Checkbox key={cat.id} value={cat.name}>
                  {cat.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="toppingNames" label="Toppings">
            <Checkbox.Group>
              {allToppings.map((top) => (
                <Checkbox key={top.id} value={top.name}>
                  {top.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate("/admin/products")}
            >
              Hủy bỏ
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default EditProduct;