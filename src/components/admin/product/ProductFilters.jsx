import { Card, Row, Col, Input, Select, Typography } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ProductFilters = ({
  searchText,
  setSearchText,
  filterCategory,
  setFilterCategory,
  filterTopping,
  setFilterTopping,
  categories,
  toppings,
  filteredProducts,
  totalProducts,
}) => {
  return (
    <Card
      style={{
        marginBottom: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "none",
      }}
      bodyStyle={{ padding: "20px" }}
    >
      <Row gutter={16} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              borderRadius: "10px",
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Lọc theo danh mục"
            size="large"
            value={filterCategory}
            onChange={setFilterCategory}
            style={{ width: "100%", borderRadius: "10px" }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả danh mục</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Select
            placeholder="Lọc theo topping"
            size="large"
            value={filterTopping}
            onChange={setFilterTopping}
            style={{ width: "100%", borderRadius: "10px" }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả topping</Option>
            {toppings.map((topping) => (
              <Option key={topping.id} value={topping.name}>
                {topping.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Text type="secondary">
              Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilters;