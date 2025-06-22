import React from "react";
import { Carousel, Button, Typography, Image } from "antd";
import { Layout } from "antd";
const { Content } = Layout;

const { Title, Text } = Typography;

const HomeCarousel = () => {
  return (
    <Content className="home-content">
      <Carousel
        autoplay
        autoplaySpeed={5000}
        effect="fade"
        dots={true}
        className="home-carousel"
      >
        <div className="carousel-slide slide-1">
          <Image
            src="https://foodking.windstripedesign.ro/images/hero/chiken.png"
            alt="Chicken"
            className="banner-image"
          />
          <Image
            src="https://foodking.windstripedesign.ro/images/shape/pizza-text.png"
            alt="Pizza Text"
            className="banner-image"
          />
          <Image
            src="https://foodking.windstripedesign.ro/images/food/pizza-2.png"
            alt="Pizza"
            className="banner-image"
          />
        </div>
        <div className="carousel-slide slide-2">
          <Image
            src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/shop-food/list/03.png"
            alt="Chicken"
            className="banner-image"
          />
          <Image
            src="https://foodking.windstripedesign.ro/images/com_hikashop/upload/thumbnails/0x0f/shop-food/list/05.png"
            alt="Noodle"
            className="banner-image"
          />
          <Image
            src="https://foodking.windstripedesign.ro/images/food/kfc.png"
            alt="Salad"
            className="banner-image"
          />
        </div>
        <div className="carousel-slide slide-3">
          <div className="carousel-text">
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              Mỗi miếng cắn <span className="highlight">giòn rụm</span> ngon khó
              cưỡng!
            </Title>
            <Text style={{ color: "#fff", fontSize: "18px" }}>
              Giao hàng <span className="highlight">siêu tốc</span> trong 30
              phút!
            </Text>
          </div>
          <Image
            src="https://foodking.windstripedesign.ro/images/offer/50percent-off-2.png"
            alt="Offer"
            className="banner-image"
          />
          <Image
            src="https://foodking.windstripedesign.ro/images/delivery-man.png"
            alt="Delivery"
            className="banner-image"
          />
          <Button
            className="order-button"
            onClick={() => (window.location.href = "/cart")}
          >
            Mua ngay
          </Button>
        </div>
      </Carousel>
    </Content>
  );
};

export default HomeCarousel;
