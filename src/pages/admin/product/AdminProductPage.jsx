import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  Modal,
  message,
  Card,
  Typography,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DollarOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import ApiService from "../../../service/ApiService";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterTopping, setFilterTopping] = useState("all");
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchToppings();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchText, filterCategory, filterTopping]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Product.getAllProduct();
      setProducts(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể tải danh sách sản phẩm"
      );
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.Category.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchToppings = async () => {
    try {
      const response = await ApiService.Topping.getAllToppings();
      setToppings(response.data || []);
    } catch (error) {
      console.error("Error fetching toppings:", error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) => cat.name === filterCategory)
      );
    }

    if (filterTopping !== "all") {
      filtered = filtered.filter((product) =>
        product.toppings?.some((top) => top.name === filterTopping)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Product.deleteProduct(productToDelete);
      setProducts(products.filter((p) => p.id !== productToDelete));
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        message.error(
          error.response?.data?.message ||
            "Không thể xóa sản phẩm vì đã có ràng buộc."
        );
      }
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return { color: "#ef4444", text: "Hết hàng", status: "error" };
    if (quantity <= 5)
      return { color: "#f59e0b", text: "Sắp hết", status: "warning" };
    return { color: "#10b981", text: "Còn hàng", status: "success" };
  };

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.availableQuantity,
    0
  );
  const lowStockProducts = products.filter(
    (product) => product.availableQuantity <= 5
  ).length;

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      fixed: "left",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={64}
            src={
              record.imageUrls && record.imageUrls.length > 0
                ? record.imageUrls[0]
                : ""
            }
            icon={<InboxOutlined />}
            style={{
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
          />
          <div>
            <Text
              strong
              style={{ fontSize: "16px", color: "#1e293b", display: "block" }}
            >
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ID: #{record.id}
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {formatPrice(record.price)}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      width: 120,
      align: "center",
      render: (quantity) => {
        const status = getStockStatus(quantity);
        return (
          <div style={{ textAlign: "center" }}>
            <Badge
              count={quantity}
              style={{
                backgroundColor: status.color,
                fontSize: "12px",
                fontWeight: "600",
                minWidth: "24px",
                height: "24px",
                lineHeight: "24px",
                borderRadius: "12px",
              }}
            />
            <div style={{ marginTop: "4px" }}>
              <Text
                style={{
                  fontSize: "11px",
                  color: status.color,
                  fontWeight: "600",
                }}
              >
                {status.text}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      width: 200,
      render: (categories) =>
        categories && categories.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {categories.slice(0, 2).map((category) => (
              <Tag
                key={category.id}
                style={{
                  background:
                    "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
                  color: "#7c3aed",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                {category.name}
              </Tag>
            ))}
            {categories.length > 2 && (
              <Tooltip
                title={categories
                  .slice(2)
                  .map((cat) => cat.name)
                  .join(", ")}
              >
                <Tag
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                >
                  +{categories.length - 2}
                </Tag>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Chưa phân loại
          </Text>
        ),
    },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      width: 200,
      render: (toppings) =>
        toppings && toppings.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {toppings.slice(0, 2).map((topping) => (
              <Tag
                key={topping.id}
                style={{
                  background:
                    "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  color: "#059669",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                {topping.name}
              </Tag>
            ))}
            {toppings.length > 2 && (
              <Tooltip
                title={toppings
                  .slice(2)
                  .map((top) => top.name)
                  .join(", ")}
              >
                <Tag
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                >
                  +{toppings.length - 2}
                </Tag>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Không có
          </Text>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space
          size="small"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/edit-product/${record.id}`)}
              style={{
                color: "#3b82f6",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              style={{
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "none",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingOutlined style={{ color: "white", fontSize: "24px" }} />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, color: "#1a202c" }}>
                Quản lý sản phẩm
              </Title>
              <Text type="secondary">
                Quản lý toàn bộ sản phẩm trong cửa hàng
              </Text>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/add-product")}
            size="large"
            style={{
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              paddingLeft: "24px",
              paddingRight: "24px",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                border: "none",
                borderRadius: "12px",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Statistic
                title={
                  <Text style={{ color: "#1e40af", fontWeight: "600" }}>
                    Tổng sản phẩm
                  </Text>
                }
                value={totalProducts}
                prefix={<AppstoreOutlined style={{ color: "#3b82f6" }} />}
                valueStyle={{ color: "#1e40af", fontWeight: "700" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                border: "none",
                borderRadius: "12px",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Statistic
                title={
                  <Text style={{ color: "#166534", fontWeight: "600" }}>
                    Tổng giá trị
                  </Text>
                }
                value={totalValue}
                prefix={<DollarOutlined style={{ color: "#059669" }} />}
                suffix="VNĐ"
                valueStyle={{ color: "#166534", fontWeight: "700" }}
                formatter={(value) => `${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "none",
                borderRadius: "12px",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Statistic
                title={
                  <Text style={{ color: "#92400e", fontWeight: "600" }}>
                    Sắp hết hàng
                  </Text>
                }
                value={lowStockProducts}
                prefix={<EyeOutlined style={{ color: "#d97706" }} />}
                valueStyle={{ color: "#92400e", fontWeight: "700" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "none",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                borderRadius: "10px",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Lọc theo danh mục"
              size="large"
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: "100%", borderRadius: "10px" }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Lọc theo topping"
              size="large"
              value={filterTopping}
              onChange={setFilterTopping}
              style={{ width: "100%", borderRadius: "10px" }}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả topping</Option>
              {toppings.map((topping) => (
                <Option key={topping.id} value={topping.name}>
                  {topping.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Text type="secondary">
                Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "none",
          background: "white",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            style: { padding: "16px 24px" },
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <InboxOutlined
                  style={{
                    fontSize: "48px",
                    color: "#d1d5db",
                    marginBottom: "16px",
                  }}
                />
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  Chưa có sản phẩm nào. Thêm một sản phẩm để bắt đầu!
                </Text>
              </div>
            ),
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </Card>

      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn
        tác.
      </Modal>

      <style jsx>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #f8fafc;
        }
        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminProductPage;
