import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/productList.css";

const ProductList = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingItem, setProcessingItem] = useState(null);

  const fetchCart = async () => {
    try {
      if (ApiService.isAuthenticated()) {
        const userInfo = await ApiService.User.getMyInfo();
        const userId = userInfo.data.id;
        const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userId);
        const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING");
        const cartItems = pendingOrder?.orderLines?.map((line) => ({
          id: line.productId,
          qty: line.quantity,
          orderLineId: line.id,
        })) || [];
        setCart(cartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  const getPendingOrder = async () => {
    try {
      if (!ApiService.isAuthenticated()) return null;
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userId);
      return ordersResponse.data?.find((order) => order.status === "PENDING") || null;
    } catch (error) {
      console.error("Error fetching pending order:", error);
      return null;
    }
  };

  const addToCart = async (product) => {
    try {
      setProcessingItem(product.id);
      if (!ApiService.isAuthenticated()) {
        if (window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?")) {
          window.location.href = "/login";
        }
        return;
      }

      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const pendingOrder = await getPendingOrder();
      const orderLineRequest = { productId: product.id, quantity: 1 };

      if (!pendingOrder) {
        await ApiService.Order.createOrder({
          userId,
          orderLines: [orderLineRequest],
          paymentMethod: "CASH_ON_DELIVERY",
        });
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
        if (existingLine) {
          await ApiService.Order.updateOrderLine(pendingOrder.id, existingLine.id, {
            productId: product.id,
            quantity: existingLine.quantity + 1,
          });
        } else {
          await ApiService.Order.addOrderLine(pendingOrder.id, orderLineRequest);
        }
      }

      window.dispatchEvent(new Event("cartChanged"));
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setProcessingItem(null);
    }
  };

  const incrementItem = async (product) => {
    try {
      setProcessingItem(product.id);
      const pendingOrder = await getPendingOrder();
      if (!pendingOrder) return;
      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
      if (!orderLine) return;
      await ApiService.Order.updateOrderLine(pendingOrder.id, orderLine.id, {
        productId: product.id,
        quantity: orderLine.quantity + 1,
      });
      window.dispatchEvent(new Event("cartChanged"));
      await fetchCart();
    } catch (error) {
      console.error("Error incrementing item:", error);
      alert(error.response?.data?.message || "Lỗi khi tăng số lượng!");
    } finally {
      setProcessingItem(null);
    }
  };

  const decrementItem = async (product) => {
    try {
      setProcessingItem(product.id);
      const pendingOrder = await getPendingOrder();
      if (!pendingOrder) return;
      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
      if (!orderLine) return;
      if (orderLine.quantity > 1) {
        await ApiService.Order.updateOrderLine(pendingOrder.id, orderLine.id, {
          productId: product.id,
          quantity: orderLine.quantity - 1,
        });
      } else {
        await ApiService.Order.deleteOrderLine(pendingOrder.id, orderLine.id);
      }
      window.dispatchEvent(new Event("cartChanged"));
      await fetchCart();
    } catch (error) {
      console.error("Error decrementing item:", error);
      alert(error.response?.data?.message || "Lỗi khi giảm số lượng!");
    } finally {
      setProcessingItem(null);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCart().finally(() => setIsLoading(false));
    window.addEventListener("cartChanged", fetchCart);
    return () => window.removeEventListener("cartChanged", fetchCart);
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const isProcessing = processingItem === product.id;

        return (
          <div className="product-item" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.imageUrls?.[0] || "/placeholder.svg?height=200&width=200"}
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
                  <button onClick={() => decrementItem(product)} disabled={isProcessing}>-</button>
                  <span>{isProcessing ? "..." : cartItem.qty}</span>
                  <button onClick={() => incrementItem(product)} disabled={isProcessing}>+</button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)} disabled={isProcessing}>
                  {isProcessing ? "Đang thêm..." : "Thêm vào giỏ"}
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