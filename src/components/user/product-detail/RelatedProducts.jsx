import React from "react";
import { Typography } from 'antd';
import ProductList from "../../../components/user/ProductList";
const { Title, Text } = Typography;
const RelatedProducts = ({ allProducts, loading, error }) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <Title level={2}>SẢN PHẨM LIÊN QUAN</Title>
      <div>
        {loading ? (
          <Text>Đang tải...</Text>
        ) : error ? (
          <Text type="error">{error}</Text>
        ) : allProducts.length === 0 ? (
          <Text>Không có sản phẩm nào.</Text>
        ) : (
          <ProductList products={allProducts.slice(0, 4)} gap="16px" />
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;