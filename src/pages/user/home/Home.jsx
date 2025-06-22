import React from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import HomeHeader from "../../../components/user/home/HomeHeader";
import HomeSider from "../../../components/user/home/HomeSider";
import HomeCarousel from "../../../components/user/home/HomeCarousel";
import HomeCategoryFilter from "../../../components/user/home/HomeCategoryFilter";
import HomeProductSection from "../../../components/user/home/HomeProductSection";
import "antd/dist/reset.css";
import "../../../static/style/home.css";

const { Content } = Layout;

const Home = () => {
  const location = useLocation();

  return (
    <Layout className="home-layout">
      <HomeHeader />
      <Layout className="sider-content-layout">
        <HomeSider />
        <Content className="home-content">
          <HomeCarousel />
        </Content>
      </Layout>
      <Content className="products-container">
        {/* <HomeCategoryFilter /> */}
        <HomeProductSection location={location} />
      </Content>
    </Layout>
  );
};

export default Home;