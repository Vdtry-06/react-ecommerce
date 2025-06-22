import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import { ShoppingOutlined, PlusOutlined } from "@ant-design/icons";
import ProductStats from "../../../components/admin/product/ProductStats";
import ProductFilters from "../../../components/admin/product/ProductFilters";
import ProductTable from "../../../components/admin/product/ProductTable";
import ProductDeleteModal from "../../../components/admin/product/ProductDeleteModal";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const { Title, Text } = Typography;

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

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalVisible(true);
  };

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.availableQuantity,
    0
  );
  const lowStockProducts = products.filter(
    (product) => product.availableQuantity <= 5
  ).length;

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
        <ProductStats
          totalProducts={totalProducts}
          totalValue={totalValue}
          lowStockProducts={lowStockProducts}
        />
      </Card>

      <ProductFilters
        searchText={searchText}
        setSearchText={setSearchText}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterTopping={filterTopping}
        setFilterTopping={setFilterTopping}
        categories={categories}
        toppings={toppings}
        filteredProducts={filteredProducts}
        totalProducts={totalProducts}
      />

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "none",
          background: "white",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <ProductTable
          products={filteredProducts}
          loading={loading}
          onDelete={handleDelete}
          navigate={navigate}
        />
      </Card>

      <ProductDeleteModal
        visible={isDeleteModalVisible}
        productId={productToDelete}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setProductToDelete(null);
        }}
        onOk={() => {
          setProducts(products.filter((p) => p.id !== productToDelete));
          setIsDeleteModalVisible(false);
          setProductToDelete(null);
        }}
        setLoading={setLoading}
      />

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