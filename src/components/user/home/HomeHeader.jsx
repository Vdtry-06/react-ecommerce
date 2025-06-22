import React from "react";
import { Typography } from "antd";
import { Layout } from "antd";
const { Header } = Layout;

const { Text } = Typography;

const HomeHeader = () => {
  return (
    <Header className="home-header">
      <Text strong>Chào bạn đến với website bán đồ uống của chúng tôi!</Text>
    </Header>
  );
};

export default HomeHeader;