import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  AppstoreOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ProductStats = ({ totalProducts, totalValue, lowStockProducts }) => {
  return (
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
  );
};

export default ProductStats;