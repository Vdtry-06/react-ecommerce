import { useCart } from "../../pages/auth/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/productList.css";
import { useState } from "react";
import Notification from "./Notification";

const ProductList = ({ products }) => {
  const { cart, syncCartWithBackend, isLoading } = useCart();
  const [processingItem, setProcessingItem] = useState(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = async (product) => {
    if (!ApiService.isAuthenticated()) {
      showNotification(
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
        "warning"
      );
      // navigate("/login");
      return;
    }

    try {
      setProcessingItem(product.id);
      const userInfo = await ApiService.User.getMyInfo();
      await syncCartWithBackend(userInfo.data.id, "ADD_ITEM", {
        id: product.id,
        toppingIds: [],
      });
      showNotification("Sản phẩm đã được thêm vào giỏ hàng!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification(
        error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!",
        "error"
      );
    } finally {
      setProcessingItem(null);
    }
  };

  const incrementItem = async (product) => {
    if (!ApiService.isAuthenticated()) {
      showNotification("Vui lòng đăng nhập để cập nhật giỏ hàng!", "warning");
      // navigate("/login");
      return;
    }

    try {
      setProcessingItem(product.id);
      const userInfo = await ApiService.User.getMyInfo();
      const cartItem = cart.find((item) => item.id === product.id);
      await syncCartWithBackend(userInfo.data.id, "INCREMENT_ITEM", {
        id: product.id,
        qty: cartItem ? cartItem.qty : 0,
        toppingIds: cartItem ? cartItem.toppingIds : [],
      });
      showNotification("Số lượng sản phẩm đã được tăng!", "success");
    } catch (error) {
      console.error("Error incrementing item:", error);
      showNotification(
        error.response?.data?.message || "Lỗi khi tăng số lượng!",
        "error"
      );
    } finally {
      setProcessingItem(null);
    }
  };

  const decrementItem = async (product) => {
    if (!ApiService.isAuthenticated()) {
      showNotification("Vui lòng đăng nhập để cập nhật giỏ hàng!", "warning");
      // navigate("/login");
      return;
    }

    try {
      setProcessingItem(product.id);
      const userInfo = await ApiService.User.getMyInfo();
      const cartItem = cart.find((item) => item.id === product.id);
      if (cartItem && cartItem.qty > 1) {
        await syncCartWithBackend(userInfo.data.id, "DECREMENT_ITEM", {
          id: product.id,
          qty: cartItem.qty,
          toppingIds: cartItem.toppingIds,
        });
      } else if (cartItem) {
        await syncCartWithBackend(userInfo.data.id, "REMOVE_ITEM", {
          id: product.id,
        });
      }
      showNotification("Số lượng sản phẩm đã được giảm!", "success");
    } catch (error) {
      console.error("Error decrementing item:", error);
      showNotification(
        error.response?.data?.message || "Lỗi khi giảm số lượng!",
        "error"
      );
    } finally {
      setProcessingItem(null);
    }
  };

  return (
    <div className="product-list">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const isProcessing = processingItem === product.id;

        return (
          <div className="product-item" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img
                src={
                  product.imageUrls?.[0] ||
                  "/placeholder.svg?height=200&width=200"
                }
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <span className="price">{product.price.toFixed(0)} VNĐ</span>
                  <span className="stock">Còn {product.availableQuantity}</span>
                </div>
              </div>
            </Link>
            <div className="product-actions">
              {cartItem ? (
                <div className="quantity-controls">
                  <button
                    onClick={() => decrementItem(product)}
                    disabled={isProcessing || isLoading}
                  >
                    -
                  </button>
                  <span>
                    {isProcessing || isLoading ? "..." : cartItem.qty}
                  </span>
                  <button
                    onClick={() => incrementItem(product)}
                    disabled={isProcessing || isLoading}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  disabled={isProcessing || isLoading}
                >
                  {isProcessing || isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
