import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Layout, Breadcrumb, theme, Button, Dropdown, Space, Carousel, Card, Checkbox, Typography, Row, Col,
} from "antd";
import 'antd/dist/reset.css';
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import "../../static/style/home.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [tempSelectedCategories, setTempSelectedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryResponse = await ApiService.Category.getAllCategories();
        setCategories(categoryResponse.data || []);

        let allProducts = [];
        const searchParams = new URLSearchParams(location.search);
        const searchItem = searchParams.get("search");

        if (searchItem) {
          const response = await ApiService.Product.getProductByName(searchItem);
          allProducts = response.data || [];
        } else if (selectedCategories.size > 0) {
          const categoryArray = Array.from(selectedCategories);
          const response = await ApiService.Product.FilterProductByCategories(categoryArray);
          allProducts = response.data || [];
        } else {
          const response = await ApiService.Product.getAllProduct(currentPage, itemsPerPage);
          allProducts = response.data || [];
        }

        setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
        setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [location.search, selectedCategories, currentPage]);

  const toggleCategory = (categoryId) => {
    setTempSelectedCategories((prev) => {
      const newCategories = new Set(prev);
      newCategories.has(categoryId) ? newCategories.delete(categoryId) : newCategories.add(categoryId);
      return newCategories;
    });
  };

  const applyFilter = () => {
    setSelectedCategories(new Set(tempSelectedCategories));
    setCurrentPage(1);
  };

  const functionItems = [
    { key: "1-1", label: "Sắp xếp theo giá tăng dần", onClick: () => window.location.href = "/home?sort=price-asc" },
    { key: "1-2", label: "Sắp xếp theo giá giảm dần", onClick: () => window.location.href = "/home?sort=price-desc" },
    {
      key: "1-3",
      label: "Lọc theo tính năng",
      children: [
        { key: "1-3-1", label: "Giao hàng nhanh", onClick: () => window.location.href = "/home?feature=fast" },
        { key: "1-3-2", label: "Bền lâu", onClick: () => window.location.href = "/home?feature=durable" },
      ],
    },
  ];

  const utilityItems = [
    { key: "2-1", label: "Sản phẩm mới nhất", onClick: () => window.location.href = "/home?filter=new" },
    {
      key: "2-2",
      label: "Tiện ích đặc biệt",
      children: [
        { key: "2-2-1", label: "Thân thiện môi trường", onClick: () => window.location.href = "/home?utility=eco" },
        { key: "2-2-2", label: "Thông minh", onClick: () => window.location.href = "/home?utility=smart" },
      ],
    },
  ];

  const reviewItems = [
    { key: "3-1", label: "Sản phẩm phổ biến", onClick: () => window.location.href = "/home?filter=popular" },
    {
      key: "3-2",
      label: "Đánh giá chi tiết",
      children: [
        { key: "3-2-1", label: "5 sao", onClick: () => window.location.href = "/home?review=5star" },
        { key: "3-2-2", label: "Đánh giá cao", onClick: () => window.location.href = "/home?review=high" },
      ],
    },
  ];

  const orderItems = [
    { key: "4-1", label: "Sản phẩm giảm giá", onClick: () => window.location.href = "/home?extra=discount" },
    {
      key: "4-2",
      label: "Ưu đãi từ 2 lần đặt trở lên",
      children: [
        { key: "4-2-1", label: "Giảm 10% sản phẩm", onClick: () => window.location.href = "/home?promo=discount-10" },
        { key: "4-2-2", label: "Thêm 1 đồ uống", onClick: () => window.location.href = "/home?promo=free-drink" },
      ],
    },
  ];

  const extraItems = [
    { key: "5-1", label: "Sản phẩm giảm giá", onClick: () => window.location.href = "/home?extra=discount" },
    {
      key: "5-2",
      label: "Khuyến mãi",
      children: [
        { key: "5-2-1", label: "Miễn phí vận chuyển", onClick: () => window.location.href = "/home?promo=free-shipping" },
        { key: "5-2-2", label: "Gói ưu đãi", onClick: () => window.location.href = "/home?promo=bundle" },
      ],
    },
  ];

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <Text strong>Chào bạn đến với website bán đồ uống của chúng tôi!</Text>
      </Header>
      <Layout className="sider-content-layout">
        <Sider className="home-sider">
          <Space direction="vertical" size="middle" className="sider-space">
            <Dropdown menu={{ items: functionItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
              <Button className="sider-button">Chức năng</Button>
            </Dropdown>
            <Dropdown menu={{ items: utilityItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
              <Button className="sider-button">Tiện ích</Button>
            </Dropdown>
            <Dropdown menu={{ items: reviewItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
              <Button className="sider-button">Đánh giá tốt</Button>
            </Dropdown>
            <Dropdown menu={{ items: orderItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
              <Button className="sider-button">Đặt hàng ngay</Button>
            </Dropdown>
            <Dropdown menu={{ items: extraItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
              <Button className="sider-button">Khác</Button>
            </Dropdown>
          </Space>
        </Sider>

        <Content className="home-content">
          <Carousel
            autoplay
            autoplaySpeed={5000}
            effect="fade"
            dots={true}
            className="home-carousel"
          >
            <div className="carousel-slide slide-1">
              <img src="https://foodking.windstripedesign.ro/images/hero/chiken.png" alt="Chicken" className="banner-image" />
              <img src="https://foodking.windstripedesign.ro/images/shape/pizza-text.png" alt="Pizza Text" className="banner-image" />
              <img src="https://foodking.windstripedesign.ro/images/food/pizza-2.png" alt="Pizza" className="banner-image" />
            </div>
            <div className="carousel-slide slide-2">
              <img src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/shop-food/list/03.png" alt="Chicken" className="banner-image" />
              <img src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/thumbnails/0x0f/shop-food/list/05.png" alt="Noodle" className="banner-image" />
              <img src="https://foodking.windstripedesign.ro/images/food/kfc.png" alt="Salad" className="banner-image" />
            </div>
            <div className="carousel-slide slide-3">
              <div className="carousel-text">
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  Mỗi miếng cắn <span className="highlight">giòn rụm</span> ngon khó cưỡng!
                </Title>
                <Text style={{ color: "#fff", fontSize: "18px" }}>
                  Giao hàng <span className="highlight">siêu tốc</span> trong 30 phút!
                </Text>
              </div>
              <img src="https://foodking.windstripedesign.ro/images/offer/50percent-off-2.png" alt="Offer" className="banner-image" />
              <img src="https://foodking.windstripedesign.ro/images/delivery-man.png" alt="Delivery" className="banner-image" />
              <Button className="order-button" onClick={() => window.location.href = "/cart"}>
                Mua ngay
              </Button>
            </div>
          </Carousel>
        </Content>
      </Layout>

      <Content className="products-container">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={6} md={5} lg={4}>
            <Card title="Danh mục" className="category-filter">
              {loading ? (
                <Text>Đang tải danh mục...</Text>
              ) : error ? (
                <Text type="danger">{error}</Text>
              ) : (
                <Space direction="vertical" size="middle">
                  <Checkbox.Group
                    value={Array.from(tempSelectedCategories)}
                    onChange={(checkedValues) => setTempSelectedCategories(new Set(checkedValues))}
                  >
                    {categories.map((category) => (
                      <Checkbox key={category.id} value={category.id}>
                        {category.name}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                  <Button
                    type="primary"
                    onClick={applyFilter}
                    disabled={tempSelectedCategories.size === 0}
                    block
                  >
                    Lọc sản phẩm
                  </Button>
                </Space>
              )}
            </Card>
          </Col>

          <Col xs={24} sm={18} md={19} lg={20}>
            {loading ? (
              <Text>Đang tải sản phẩm...</Text>
            ) : error ? (
              <Text type="danger">{error}</Text>
            ) : products.length === 0 ? (
              <Text>Không tìm thấy sản phẩm nào</Text>
            ) : (
              <div>
                <ProductList products={products} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;