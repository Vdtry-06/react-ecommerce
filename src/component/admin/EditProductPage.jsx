import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, Checkbox, message, Spin, Card, Typography, Space } from "antd";
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import ApiService from "../../service/ApiService";

const { Title } = Typography;
const { TextArea } = Input;

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    fetchProduct(productId);
    fetchAllCategories();
    fetchAllToppings();
  }, [productId]);

  const fetchProduct = async (id) => {
    setLoading(true);
    try {
      const response = await ApiService.Product.getProduct(id);
      const productData = response.data;
      console.log("Fetched product data:", productData);
      if (productData.imageUrls && productData.imageUrls.length > 0) {
        setFileList(
          productData.imageUrls.map((url, index) => ({
            uid: `-${index}`,
            name: `image${index + 1}`,
            status: "done",
            url,
          }))
        );
      }
      setIsDataReady(false);
    } catch (error) {
      message.error("Không thể tải thông tin sản phẩm");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await ApiService.Category.getAllCategories();
      setAllCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching all categories:", error);
    }
  };

  const fetchAllToppings = async () => {
    try {
      const response = await ApiService.Topping.getAllToppings();
      setAllToppings(response.data || []);
    } catch (error) {
      console.error("Error fetching all toppings:", error);
    }
  };

  useEffect(() => {
    if (allCategories.length > 0 && allToppings.length > 0 && !isDataReady) {
      fetchProduct(productId).then(() => {
        setIsDataReady(true);
      });
    }
  }, [allCategories, allToppings, productId, isDataReady]);

  useEffect(() => {
    if (isDataReady) {
      ApiService.Product.getProduct(productId).then((response) => {
        const productData = response.data;
        form.setFieldsValue({
          name: productData.name || "",
          description: productData.description || "",
          availableQuantity: productData.availableQuantity || "",
          price: productData.price || "",
          categoryNames: productData.categories?.map((cat) => cat.name) || [],
          toppingNames: productData.toppings?.map((top) => top.name) || [],
        });
        console.log("Form values set:", form.getFieldsValue()); // Log để kiểm tra
      }).catch((error) => {
        message.error("Không thể tải lại thông tin sản phẩm");
        console.error("Error refetching product:", error);
      });
    }
  }, [isDataReady, productId, form]);

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("availableQuantity", values.availableQuantity);
      formData.append("price", values.price);

      if (values.categoryNames) {
        values.categoryNames.forEach((name) => formData.append("categoryNames", name));
      }
      if (values.toppingNames) {
        values.toppingNames.forEach((name) => formData.append("toppingNames", name));
      }

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      const response = await ApiService.Product.updateProduct(productId, formData);
      if (response.status === 200) {
        message.success("Sản phẩm đã được cập nhật thành công!");
        setTimeout(() => navigate("/admin/products"), 1000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật sản phẩm");
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onChange: handleImageChange,
    fileList,
    beforeUpload: () => false,
    multiple: true,
    listType: "picture-card",
    accept: "image/*",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          gap: "16px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/products")}
          style={{
            borderRadius: "8px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Quay lại
        </Button>
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
            <ShoppingOutlined style={{ color: "white", fontSize: "20px" }} />
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
            Chỉnh sửa sản phẩm
          </Title>
        </div>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: "800px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <Form.Item
                name="name"
                label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Tên sản phẩm</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input
                  placeholder="Nhập tên sản phẩm..."
                  style={{ height: "48px", borderRadius: "8px", fontSize: "16px" }}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Giá (VNĐ)</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm" },
                  { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
                ]}
                normalize={(value) => (value ? Number(value) : value)}
              >
                <Input
                  type="number"
                  step="1"
                  placeholder="Nhập giá sản phẩm..."
                  style={{ height: "48px", borderRadius: "8px", fontSize: "16px" }}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Mô tả sản phẩm</span>}
            >
              <TextArea
                rows={4}
                placeholder="Nhập mô tả sản phẩm..."
                style={{ borderRadius: "8px", fontSize: "16px" }}
              />
            </Form.Item>

            <Form.Item
              name="availableQuantity"
              label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Số lượng có sẵn</span>}
              rules={[
                { required: true, message: "Vui lòng nhập số lượng" },
                { type: "number", min: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" },
              ]}
              normalize={(value) => (value ? Number(value) : value)}
            >
              <Input
                type="number"
                placeholder="Nhập số lượng có sẵn..."
                style={{ height: "48px", borderRadius: "8px", fontSize: "16px" }}
              />
            </Form.Item>

            <Form.Item
              name="categoryNames"
              label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Danh mục sản phẩm</span>}
            >
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#f8fafc",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {allCategories.map((cat) => (
                      <Checkbox
                        key={cat.id}
                        value={cat.name}
                        style={{ padding: "8px 12px", borderRadius: "6px", transition: "all 0.2s ease" }}
                      >
                        {cat.name}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </div>
            </Form.Item>

            <Form.Item
              name="toppingNames"
              label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Toppings</span>}
            >
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#f8fafc",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {allToppings.map((top) => (
                      <Checkbox
                        key={top.id}
                        value={top.name}
                        style={{ padding: "8px 12px", borderRadius: "6px", transition: "all 0.2s ease" }}
                      >
                        {top.name} ({top.price.toLocaleString("vi-VN")} VNĐ)
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </div>
            </Form.Item>

            <Form.Item
              label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Hình ảnh sản phẩm</span>}
            >
              <Upload {...uploadProps}>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "2px dashed #d1d5db",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <PlusOutlined style={{ fontSize: "24px", color: "#64748b", marginBottom: "8px" }} />
                  <span style={{ color: "#64748b", fontSize: "12px" }}>Thêm ảnh</span>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
              <Space size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<EditOutlined />}
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    minWidth: "160px",
                  }}
                >
                  Cập nhật sản phẩm
                </Button>
                <Button
                  onClick={() => navigate("/admin/products")}
                  style={{ height: "48px", borderRadius: "8px", fontSize: "16px", minWidth: "120px" }}
                >
                  Hủy bỏ
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default EditProduct;