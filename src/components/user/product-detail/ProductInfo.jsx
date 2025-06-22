import React from "react";
import { Rate, Tag, Button, Space, Checkbox, Typography } from "antd";
const { Text, Paragraph } = Typography;

const ProductInfo = ({
  product,
  displayProduct,
  cartItem,
  selectedToppings,
  isProcessing,
  isLoading,
  handleToppingChange,
  addToCart,
  buyNow,
  updateQuantity,
  toggleWishlist,
  productId,
  wishlist,
}) => {
  const toppings = Array.isArray(product.toppings) ? product.toppings : [];

  return (
    <div className="product-info" style={{ flex: "1", minWidth: "300px" }}>
      <Rate
        disabled
        value={5}
        style={{ color: "#FFD700", fontSize: 16, marginBottom: "16px" }}
      />

      <Text level={2} style={{ margin: "0 0 16px", fontWeight: "600", color: "#333" }}>
        {displayProduct.name}
      </Text>

      <Paragraph style={{ marginBottom: "24px", color: "#666", lineHeight: "1.6" }}>
        {displayProduct.description}
      </Paragraph>

      <div className="price" style={{ marginBottom: "20px" }}>
        <Tag color="#f50" style={{ marginRight: "8px", fontSize: "14px" }}>
          -{displayProduct.discount}%
        </Tag>
        <span style={{ fontSize: "24px", fontWeight: "700", color: "#f50" }}>
          {displayProduct.price.toFixed(2)} VNĐ
        </span>
        {displayProduct.originalPrice > 0 && (
          <span
            style={{ fontSize: "16px", color: "#999", textDecoration: "line-through", marginLeft: "10px" }}
          >
            {displayProduct.originalPrice.toFixed(2)} VNĐ
          </span>
        )}
      </div>

      <div className="toppings-list">
        <h3 className="toppings-title">Chọn Toppings:</h3>
        {toppings.length > 0 ? (
          <ul className="topping-items">
            {toppings
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((topping) => (
                <li key={topping.id} className="topping-item">
                  <label className="topping-label">
                    <Checkbox
                      checked={selectedToppings.includes(topping.id)}
                      onChange={() => handleToppingChange(topping.id)}
                      disabled={isProcessing || isLoading}
                    />
                    <span className="topping-name">{topping.name}</span>
                    <span className="topping-price">+{topping.price.toFixed(2)} VNĐ</span>
                  </label>
                </li>
              ))}
          </ul>
        ) : (
          <p className="no-toppings">Không có topping nào.</p>
        )}
      </div>

      {cartItem ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Button
            onClick={() => updateQuantity(false)}
            disabled={isProcessing || isLoading}
            style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "4px" }}
          >
            <span style={{ fontSize: "20px" }}>−</span>
          </Button>
          <span style={{ fontSize: "16px", minWidth: "30px", textAlign: "center" }}>
            {isProcessing || isLoading ? "..." : cartItem.qty}
          </span>
          <Button
            onClick={() => updateQuantity(true)}
            disabled={isProcessing || isLoading}
            style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "4px" }}
          >
            <span style={{ fontSize: "20px"}}>+</span>
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            size="large"
            onClick={addToCart}
            disabled={isProcessing || isLoading || product.availableQuantity <= 0}
            style={{ background: "#007bff", borderColor: "#007bff", borderRadius: "4px" }}
          >
            {isProcessing || isLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={buyNow}
            disabled={isProcessing || isLoading || product.availableQuantity <= 0}
            style={{ background: "#ff4500", borderColor: "#ff4500", borderRadius: "4px" }}
          >
            {isProcessing || isLoading ? "Đang xử lý..." : "Mua ngay"}
          </Button>
        </div>
      )}

      <div className="meta" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Text strong style={{ color: "#333" }}>Danh mục:</Text>
          <span style={{ marginLeft: "8px", color: "#666" }}>{displayProduct.categories}</span>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <Text strong style={{ color: "#333" }}>Mô tả:</Text>
          <span style={{ marginLeft: "8px", color: "#666" }}>{displayProduct.categoriesDescription}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;