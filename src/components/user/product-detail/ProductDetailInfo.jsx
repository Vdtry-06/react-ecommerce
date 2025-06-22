import React from "react";
import { List, Space, Row, Col, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Title } = Typography;

const ProductDetailInfo = ({ product }) => {
  return (
    <div style={{ marginTop: "40px" }}>
      <Title level={3}>THÔNG TIN CHI TIẾT</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <List
            itemLayout="horizontal"
            dataSource={product.categories || []}
            renderItem={(category) => (
              <List.Item>
                <Space>
                  <CheckOutlined style={{ color: "#006241" }} />
                  <strong>{category.name}</strong>
                </Space>
              </List.Item>
            )}
          />
        </Col>
        <Col xs={24} md={12}>
          <List
            itemLayout="horizontal"
            dataSource={product.categories || []}
            renderItem={(category) => (
              <List.Item>
                <Space>
                  <CheckOutlined style={{ color: "#006241" }} />
                  <span>{category.description || "N/A"}</span>
                </Space>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailInfo;