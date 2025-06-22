import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Typography,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DollarOutlined,
  AppstoreOutlined,
  TagOutlined,
} from "@ant-design/icons";
import ApiService from "../../../service/ApiService";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const ProductForm = ({ mode, navigate, productId }) => {
  const [form] = Form.useForm();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");

  useEffect(() => {
    fetchAllCategories();
    fetchAllToppings();
    if (mode === "edit" && productId) {
      fetchProduct(productId);
    }
  }, [mode, productId]);

  const fetchProduct = async (id) => {
    setInitialLoading(true);
    try {
      const response = await ApiService.Product.getProduct(id);
      const productData = response.data;

      form.setFieldsValue({
        name: productData.name || "",
        description: productData.description || "",
        availableQuantity: productData.availableQuantity || "",
        price: productData.price || "",
        categoryNames: productData.categories?.map((cat) => cat.name) || [],
        toppingNames: productData.toppings?.map((top) => top.name) || [],
      });

      if (productData.imageUrls && productData.imageUrls.length > 0) {
        const existingImages = productData.imageUrls.map((url, index) => ({
          uid: `-existing-${index}`,
          name: `existing-image-${index + 1}`,
          status: "done",
          url: url,
        }));
        setImagePreviews(existingImages);
        form.setFieldValue("images", []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Không thể tải dữ liệu sản phẩm");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await ApiService.Category.getAllCategories();
      setAllCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching all categories:", error);
      message.error("Không thể tải danh sách danh mục");
    }
  };

  const fetchAllToppings = async () => {
    try {
      const response = await ApiService.Topping.getAllToppings();
      setAllToppings(response.data || []);
    } catch (error) {
      console.error("Error fetching all toppings:", error);
      message.error("Không thể tải danh sách topping");
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    const files = newFileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);

    setImagePreviews(
      newFileList.map((file) => ({
        uid: file.uid,
        url: file.originFileObj
          ? URL.createObjectURL(file.originFileObj)
          : file.url,
        name: file.name,
        status: file.status,
      }))
    );
    form.setFieldValue("images", files);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append(
        "description",
        values.description ? values.description.trim() : ""
      );

      const availableQuantity = Number.parseFloat(values.availableQuantity);
      if (isNaN(availableQuantity) || availableQuantity < 0) {
        throw new Error("Số lượng không hợp lệ");
      }
      formData.append("availableQuantity", availableQuantity);

      const price = Number.parseFloat(values.price);
      if (isNaN(price) || price < 0) {
        throw new Error("Giá không hợp lệ");
      }
      formData.append("price", price);

      if (values.categoryNames) {
        values.categoryNames.forEach((name) =>
          formData.append("categoryNames", name.trim())
        );
      }
      if (values.toppingNames) {
        values.toppingNames.forEach((name) =>
          formData.append("toppingNames", name.trim())
        );
      }
      if (values.images) {
        values.images.forEach((file) => formData.append("files", file));
      }

      const response =
        mode === "edit"
          ? await ApiService.Product.updateProduct(productId, formData)
          : await ApiService.Product.addProduct(formData);

      if (response.status === 200 || response.status === 201) {
        message.success(
          `Sản phẩm đã được ${mode === "edit" ? "cập nhật" : "thêm"} thành công!`
        );
        form.resetFields();
        setImagePreviews([]);
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      } else {
        message.error(
          `${mode === "edit" ? "Cập nhật" : "Thêm"} sản phẩm thất bại: Status không hợp lệ`
        );
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Không thể ${mode === "edit" ? "cập nhật" : "thêm"} sản phẩm`;
      if (errorMessage.includes("PRODUCT_NAME_EXISTS")) {
        message.error("Tên sản phẩm đã tồn tại");
      } else if (errorMessage.includes("NEGATIVE_QUANTITY")) {
        message.error("Số lượng không được âm");
      } else if (errorMessage.includes("NEGATIVE_PRICE")) {
        message.error("Giá không được âm");
      } else if (errorMessage.includes("CATEGORY_NOT_EXISTED")) {
        message.error("Một hoặc nhiều danh mục không tồn tại");
      } else if (errorMessage.includes("TOPPING_NOT_EXISTED")) {
        message.error("Một hoặc nhiều topping không tồn tại");
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (initialLoading) {
    return (
      <div
        style={{
          padding: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "none",
        background: "white",
      }}
      bodyStyle={{ padding: "32px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.log("Form validation failed:", errorInfo);
          message.error("Vui lòng kiểm tra các trường bắt buộc");
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Tên sản phẩm
                  </Text>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input
                  placeholder="Nhập tên sản phẩm..."
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    border: "2px solid #e2e8f0",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item
                name="price"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Giá (VNĐ)
                  </Text>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập giá" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá phải lớn hơn hoặc bằng 0",
                  },
                ]}
                normalize={(value) => (value ? Number.parseFloat(value) : value)}
              >
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Nhập giá sản phẩm..."
                  prefix={<DollarOutlined style={{ color: "#667eea" }} />}
                  suffix="VNĐ"
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    border: "2px solid #e2e8f0",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                name="description"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Mô tả sản phẩm
                  </Text>
                }
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm..."
                  style={{
                    borderRadius: "10px",
                    fontSize: "16px",
                    border: "2px solid #e2e8f0",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                name="availableQuantity"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Số lượng có sẵn
                  </Text>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" },
                  {
                    type: "number",
                    min: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0",
                  },
                ]}
                normalize={(value) => (value ? Number.parseFloat(value) : value)}
              >
                <Input
                  type="number"
                  step="1"
                  placeholder="Nhập số lượng..."
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    border: "2px solid #e2e8f0",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div style={{ marginBottom: "32px" }}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="categoryNames"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Danh mục sản phẩm
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một danh mục",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn danh mục sản phẩm..."
                  style={{
                    minHeight: "48px",
                    fontSize: "16px",
                  }}
                  optionLabelProp="label"
                  maxTagCount="responsive"
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <Tag
                        color="blue"
                        closable={closable}
                        onClose={onClose}
                        style={{ margin: "2px", borderRadius: "6px" }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                >
                  {allCategories.length > 0 ? (
                    allCategories.map((category) => (
                      <Option
                        key={category.id}
                        value={category.name}
                        label={category.name}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <AppstoreOutlined style={{ color: "#667eea" }} />
                          <span>{category.name}</span>
                        </div>
                      </Option>
                    ))
                  ) : (
                    <Option disabled value="">
                      Không có danh mục nào
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item
                name="toppingNames"
                label={
                  <Text strong style={{ fontSize: "16px", color: "#000000" }}>
                    Toppings
                  </Text>
                }
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn toppings..."
                  style={{
                    minHeight: "48px",
                    fontSize: "16px",
                  }}
                  optionLabelProp="label"
                  maxTagCount="responsive"
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <Tag
                        color="green"
                        closable={closable}
                        onClose={onClose}
                        style={{ margin: "2px", borderRadius: "6px" }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                >
                  {allToppings.length > 0 ? (
                    allToppings.map((topping) => (
                      <Option
                        key={topping.id}
                        value={topping.name}
                        label={`${topping.name} (${formatPrice(topping.price)})`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <TagOutlined style={{ color: "#10b981" }} />
                            <span>{topping.name}</span>
                          </div>
                          <Text type="secondary" style={{ fontSize: "14px" }}>
                            {formatPrice(topping.price)}
                          </Text>
                        </div>
                      </Option>
                    ))
                  ) : (
                    <Option disabled value="">
                      Không có topping nào
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div style={{ marginBottom: "32px" }}>
          <Form.Item name="images">
            <Upload
              beforeUpload={() => false}
              onChange={handleImageChange}
              fileList={imagePreviews}
              multiple
              listType="picture-card"
              accept="image/*"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "2px dashed #d1d5db",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                }}
              >
                <PlusOutlined
                  style={{
                    fontSize: "24px",
                    color: "#667eea",
                    marginBottom: "8px",
                  }}
                />
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Thêm ảnh
                </Text>
              </div>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: "40px", marginBottom: 0 }}>
          <Space
            size="large"
            style={{ width: "100%", justifyContent: "flex-start" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={mode === "edit" ? <EditOutlined /> : <PlusOutlined />}
              size="large"
              style={{
                height: "52px",
                borderRadius: "12px",
                background:
                  mode === "edit"
                    ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                minWidth: "180px",
                boxShadow:
                  mode === "edit"
                    ? "0 4px 15px rgba(240, 147, 251, 0.4)"
                    : "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
            >
              {loading
                ? `Đang ${mode === "edit" ? "cập nhật" : "thêm"}...`
                : `${mode === "edit" ? "Cập nhật" : "Thêm"} sản phẩm`}
            </Button>
            <Button
              onClick={() => navigate("/admin/products")}
              size="large"
              style={{
                height: "52px",
                borderRadius: "12px",
                fontSize: "16px",
                minWidth: "120px",
                border: "2px solid #e2e8f0",
              }}
            >
              Hủy bỏ
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm;