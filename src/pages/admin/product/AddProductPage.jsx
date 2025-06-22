import { useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "antd";
import { ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import ProductForm from "../../../components/admin/product/ProductForm";

const { Title, Text } = Typography;

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "none",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/products")}
              style={{
                borderRadius: "10px",
                height: "40px",
                border: "1px solid #e2e8f0",
                background: "white",
              }}
            >
              Quay lại
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingOutlined
                  style={{ color: "white", fontSize: "24px" }}
                />
              </div>
              <div>
                <Title level={2} style={{ margin: 0, color: "#1a202c" }}>
                  Thêm sản phẩm mới
                </Title>
                <Text type="secondary">
                  Tạo sản phẩm mới cho cửa hàng của bạn
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ProductForm mode="add" navigate={navigate} />
    </div>
  );
};

export default AddProduct;