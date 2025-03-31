import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, theme, Button, Dropdown, Space, Carousel } from "antd";
import 'antd/dist/reset.css'; // Ant Design v5 styles
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import "../../static/style/home.css";

const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const categoryResponse = await ApiService.getAllCategories();
        setCategories(categoryResponse.data || []);

        let allProducts = [];
        const searchParams = new URLSearchParams(location.search);
        const searchItem = searchParams.get("search");
        const categoryFilter = searchParams.get("categories");

        if (searchItem) {
          const response = await ApiService.getProductByName(searchItem);
          allProducts = response.data || [];
        } else if (categoryFilter) {
          const categoryArray = categoryFilter.split(",");
          const response = await ApiService.getProductsByCategories(categoryArray);
          allProducts = response.data || [];
        } else {
          const response = await ApiService.getAllProduct(currentPage, itemsPerPage);
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
  }, [location.search, currentPage]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      const newCategories = new Set(prev);
      newCategories.has(categoryId) ? newCategories.delete(categoryId) : newCategories.add(categoryId);
      return newCategories;
    });
  };

  const applyFilter = () => {
    const categoryArray = Array.from(selectedCategories);
    if (categoryArray.length > 0) {
      navigate(`/category-products?categories=${categoryArray.join(",")}`);
    }
  };

  const functionItems = [
    { key: "1-1", label: "Sắp xếp theo giá tăng dần", onClick: () => navigate("/home?sort=price-asc") },
    { key: "1-2", label: "Sắp xếp theo giá giảm dần", onClick: () => navigate("/home?sort=price-desc") },
    {
      key: "1-3",
      label: "Lọc theo tính năng",
      children: [
        { key: "1-3-1", label: "Giao hàng nhanh", onClick: () => navigate("/home?feature=fast") },
        { key: "1-3-2", label: "Bền lâu", onClick: () => navigate("/home?feature=durable") },
      ],
    },
  ];

  const utilityItems = [
    { key: "2-1", label: "Sản phẩm mới nhất", onClick: () => navigate("/home?filter=new") },
    {
      key: "2-2",
      label: "Tiện ích đặc biệt",
      children: [
        { key: "2-2-1", label: "Thân thiện môi trường", onClick: () => navigate("/home?utility=eco") },
        { key: "2-2-2", label: "Thông minh", onClick: () => navigate("/home?utility=smart") },
      ],
    },
  ];

  const reviewItems = [
    { key: "3-1", label: "Sản phẩm phổ biến", onClick: () => navigate("/home?filter=popular") },
    {
      key: "3-2",
      label: "Đánh giá chi tiết",
      children: [
        { key: "3-2-1", label: "5 sao", onClick: () => navigate("/home?review=5star") },
        { key: "3-2-2", label: "Đánh giá cao", onClick: () => navigate("/home?review=high") },
      ],
    },
  ];

  const orderItems = [
    { key: "4-1", label: "Sản phẩm giảm giá", onClick: () => navigate("/home?extra=discount") },
    {
      key: "4-2",
      label: "Ưu đãi từ 2 lần đặt trở lên",
      children: [
        { key: "4-2-1", label: "Giảm 10% sản phẩm", onClick: () => navigate("/home?promo=discount-10") },
        { key: "4-2-2", label: "Thêm 1 đồ uống", onClick: () => navigate("/home?promo=free-drink") },
      ],
    },
  ];

  const extraItems = [
    { key: "5-1", label: "Sản phẩm giảm giá", onClick: () => navigate("/home?extra=discount") },
    {
      key: "5-2",
      label: "Khuyến mãi",
      children: [
        { key: "5-2-1", label: "Miễn phí vận chuyển", onClick: () => navigate("/home?promo=free-shipping") },
        { key: "5-2-2", label: "Gói ưu đãi", onClick: () => navigate("/home?promo=bundle") },
      ],
    },
  ];

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <p>Chào bạn đến với website bán đồ ăn nhanh của chúng tôi!</p>
        <div className="demo-logo" />
      </Header>
      <Layout className="sider-content-layout">
        <Sider className="home-sider">
          <Space direction="vertical" className="sider-space">
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
            <div className="banner-container">
                <Carousel 
                autoplay 
                autoplaySpeed={5000} 
                effect="fade"
                dots={true}
                >
                <div className="carousel-slide slide-1">
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
                <div className="carousel-slide slide-2">
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
                </div>
                <div className="carousel-slide slide-3">
                    <div className="carousel-text">
                    <p>Mỗi miếng cắn <span className="highlight">giòn rụm</span> ngon khó cưỡng!</p>
                    <p>Giao hàng <span className="highlight">siêu tốc</span> trong 30 phút!</p>
                    </div>
                    <img 
                    src="https://foodking.windstripedesign.ro/images/offer/50percent-off-2.png" 
                    alt="Delivery" 
                    className="banner-image" 
                    />
                    <img 
                    src="https://foodking.windstripedesign.ro/images/delivery-man.png" 
                    alt="Delivery" 
                    className="banner-image" 
                    />
                    <button
                        className="order-button"
                        onClick={() => (window.location.href = "/cart")}
                        >
                        Mua ngay
                    </button>
                </div>
                </Carousel>
            </div>
            </Content>

      </Layout>

      <div className="products-container">
        <div className="products-flex">
          <div className="category-filter">
            <h3>Danh mục</h3>
            {loading ? (
              <p>Đang tải danh mục...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : (
              <div>
                <ul className="category-list">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <label>
                        <input
                          type="checkbox"
                          onChange={() => toggleCategory(category.id)}
                          checked={selectedCategories.has(category.id)}
                        />
                        {category.name}
                      </label>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={applyFilter}
                  disabled={selectedCategories.size === 0}
                  className="filter-button"
                >
                  Lọc sản phẩm
                </Button>
              </div>
            )}
          </div>

          <div className="product-list">
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : products.length === 0 ? (
              <p>Không tìm thấy sản phẩm nào</p>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;