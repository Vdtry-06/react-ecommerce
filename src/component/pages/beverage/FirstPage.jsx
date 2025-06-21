import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Breadcrumb,
  theme,
  Button,
  Dropdown,
  Space,
  Carousel,
  Card,
  Checkbox,
  Typography,
  Row,
  Col,
} from "antd";
import ProductList from "../../common/ProductList";
import Pagination from "../../common/Pagination";
import ApiService from "../../../service/ApiService";
import "../../../static/style/first-page.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const FirstPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;
  const trangChuRef = useRef(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const promoItems = [
    {
      title: "ĐẶC BIỆT HÔM NAY",
      subtitle: "Thịt bò Burger",
      price: "$5.00",
      image: "https://foodking.windstripedesign.ro/images/food/big-burger.png",
      textImage:
        "https://foodking.windstripedesign.ro/images/shape/burger-text.png",
      buttonText: "ORDER NOW",
    },
    {
      title: "BỮA ĂN NHANH",
      subtitle: "Mùi thơm hấp dẫn của những chiếc bánh mì kẹp thịt đang cháy",
      discount:
        "https://foodking.windstripedesign.ro/images/offer/50percent-off-3.png",
      image: "https://foodking.windstripedesign.ro/images/food/roller-box.png",
      buttonText: "ORDER NOW",
    },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoryResponse = await ApiService.Category.getAllCategories();
        setCategories(categoryResponse.data || []);

        let fetchedProducts = [];
        const searchParams = new URLSearchParams(location.search);
        const searchItem = searchParams.get("search");
        const categoryFilter = searchParams.get("categories");

        if (searchItem) {
          const response =
            await ApiService.Product.getProductByName(searchItem);
          fetchedProducts = response.data || [];
        } else if (categoryFilter) {
          const categoryArray = categoryFilter.split(",");
          const response =
            await ApiService.Product.FilterProductByCategories(categoryArray);
          fetchedProducts = response.data || [];
        } else {
          const response = await ApiService.Product.getAllProduct();
          fetchedProducts = response.data || [];
        }

        setAllProducts(fetchedProducts);
        const shuffled = [...fetchedProducts].sort(() => Math.random() - 0.5);
        setRandomProducts(shuffled.slice(0, 4));
        setTotalPages(Math.ceil(fetchedProducts.length / itemsPerPage));
        setDisplayedProducts(
          fetchedProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [location.search, currentPage]);

  return (
    <Layout className="firt-layout">
      <Header className="firt-header">
        <Text strong style={{ fontSize: 16 }}>
          Chào bạn đến với website bán đồ uống của chúng tôi!
        </Text>
      </Header>

      <div className="promo-section">
        <div className="promo-content">
          <Title level={2} className="promo-title">
            Thưởng thức món ăn nhanh ngon tuyệt!
          </Title>
          <Text className="promo-text">
            Đặt hàng ngay để nhận ưu đãi lên đến 50%!
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/cart")}
            className="promo-button"
          >
            Đặt hàng ngay
          </Button>
        </div>
        <img
          src="https://foodking.windstripedesign.ro/images/food/grilled.png"
          alt="Grilled Food"
          className="promo-image grilled"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/shape/spicy.png"
          alt="Spicy Shape"
          className="promo-image spicy"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/shape/tomato-shape-2.png"
          alt="Tomato Shape"
          className="promo-image tomato"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/shape/pizza-text-2.png"
          alt="Pizza Text"
          className="promo-image potato"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/food/main-food.png"
          alt="Main Food"
          className="promo-image pizza-text"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/offer/50percent-off-2.png"
          alt="50% Off"
          className="promo-image offer"
        />
      </div>

      <div className="products-container-4" style={{ padding: "24px" }}>
        <Col xs={24} sm={18} md={19} lg={20}>
          {loading ? (
            <Text>Đang tải sản phẩm...</Text>
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : allProducts.length === 0 ? (
            <Text>Không tìm thấy sản phẩm nào</Text>
          ) : (
            <div>
              <ProductList
                products={[...allProducts]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 4)}
                gap="16px"
              />
            </div>
          )}
        </Col>
      </div>

      <div className="about-section">
        <img
          src="https://foodking.windstripedesign.ro/images/about/burger.png"
          alt="Burger"
          className="about-image burger"
        />
        <img
          src="https://foodking.windstripedesign.ro/images/about/burger-text.png"
          alt="Burger Text"
          className="about-image text"
        />
        <div className="about-content">
          <Title level={2} className="about-title">
            NƠI CHẤT LƯỢNG GẶP DỊCH VỤ HOÀN HẢO
          </Title>
          <Text className="about-subtitle">
            Trải nghiệm ăn uống hoàn hảo với mọi món ăn được chế biến từ nguyên
            liệu tươi ngon, chất lượng cao. Đội ngũ của chúng tôi cam kết mang
            đến trải nghiệm độc đáo với âm nhạc và nghệ thuật tương tác.
          </Text>
          <br />
          <br />
          <Button
            type="primary"
            className="about-button"
            onClick={() => navigate("/")}
          >
            TÌM HIỂU THÊM VỀ CHÚNG TÔI
          </Button>
        </div>
      </div>

      <Content className="firt-content2">
        <Carousel
          autoplay
          autoplaySpeed={3000}
          effect="fade"
          dots={true}
          className="firt-carousel2"
        >
          <div className="carousel-slide2 slide-1">
            <img
              src="https://foodking.windstripedesign.ro/images/hero/chiken.png"
              alt="Chicken"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/shape/pizza-text.png"
              alt="Pizza Text"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/food/pizza-2.png"
              alt="Pizza"
              className="banner-image"
            />
          </div>
          <div className="carousel-slide2 slide-2">
            <img
              src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/shop-food/list/03.png"
              alt="Chicken"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/thumbnails/0x0f/shop-food/list/05.png"
              alt="Noodle"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/food/kfc.png"
              alt="Salad"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/about-food/potato.png"
              alt="Pizza Text"
              className="banner-image"
            />
          </div>
          <div className="carousel-slide2 slide-3">
            <img
              src="https://foodking.windstripedesign.ro/images/food/kfc.png"
              alt="Salad"
              className="banner-image"
            />
            <img
              src="https://foodking.windstripedesign.ro/images/delivery-man.png"
              alt="Delivery"
              className="banner-image"
            />
            <Button className="order-button" onClick={() => navigate("/cart")}>
              Mua ngay
            </Button>
            <img
              src="https://foodking.windstripedesign.ro/images/about-food/potato.png"
              alt="Pizza Text"
              className="banner-image"
            />
          </div>
        </Carousel>

        <div className="products-container-4" style={{ padding: "24px" }}>
          <Col xs={24} sm={18} md={19} lg={20}>
            {loading ? (
              <Text>Đang tải sản phẩm...</Text>
            ) : error ? (
              <Text type="danger">{error}</Text>
            ) : allProducts.length === 0 ? (
              <Text>Không tìm thấy sản phẩm nào</Text>
            ) : (
              <div>
                <ProductList
                  products={[...allProducts]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4)}
                  gap="16px"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </Col>
        </div>

        <div className="carousel-slide3 slide-3">
          <div className="carousel-text3">
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              Mỗi miếng cắn <span className="highlight">giòn rụm</span> ngon khó
              cưỡng!
            </Title>
            <Text style={{ color: "#fff", fontSize: "18px" }}>
              Giao hàng <span className="highlight">siêu tốc</span> trong 30
              phút!
            </Text>
          </div>
          <img
            src="https://foodking.windstripedesign.ro/images/food/grilled.png"
            alt="Grilled Food"
            className="banner-image"
          />
          <img
            src="https://foodking.windstripedesign.ro/images/food/kfc.png"
            alt="Salad"
            className="banner-image"
          />
          <img
            src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/shop-food/list/02.png"
            alt="Pizza"
            className="banner-image"
          />
          <img
            src="https://foodking.windstripedesign.ro/images/offer/50percent-off-2.png"
            alt="Offer"
            className="banner-image"
          />
          <img
            src="https://foodking.windstripedesign.ro/images/choose/01.png"
            alt="Delivery"
            className="banner-image"
          />
        </div>
        <div className="promo-section">
          <Row gutter={[16, 16]} justify="center">
            {promoItems.map((item, index) => (
              <Col xs={24} sm={12} md={12} lg={12} key={index}>
                <Card
                  className="promo-card"
                  cover={
                    <div className="promo-image-container">
                      <img
                        src={item.image}
                        alt={item.subtitle}
                        className="promo-main-image"
                      />
                      {item.textImage && (
                        <img
                          src={item.textImage}
                          alt="Text"
                          className="promo-text-image"
                        />
                      )}
                      {item.discount && (
                        <img
                          src={item.discount}
                          alt="Discount"
                          className="promo-discount"
                        />
                      )}
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      className="promo-button"
                      onClick={() => navigate("/cart")}
                    >
                      {item.buttonText}
                    </Button>,
                  ]}
                >
                  <Title level={3} className="promo-title">
                    {item.title}
                  </Title>
                  {item.subtitle && (
                    <Text className="promo-subtitle">{item.subtitle}</Text>
                  )}
                  {item.price && (
                    <Text className="promo-price">{item.price}</Text>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default FirstPage;
