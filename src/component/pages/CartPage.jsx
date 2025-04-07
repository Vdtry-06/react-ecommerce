import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/cart.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCart = async () => {
    try {
      if (!ApiService.isAuthenticated()) {
        throw new Error("Bạn cần đăng nhập!");
      }
      setLoading(true);
      const userInfo = await ApiService.getMyInfo();
      const userId = userInfo.data.id;
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
      const orders = ordersResponse.data || [];

      const pendingOrder = orders.find((order) => order.status === "PENDING") || { orderLines: [] };

      if (pendingOrder.orderLines.length === 0) {
        setCart([]);
        setSelectedItems(new Set());
        return;
      }

      const cartItems = await Promise.all(
        pendingOrder.orderLines.map(async (line) => {
          try {
            const productResponse = await ApiService.getProduct(line.productId);
            const product = productResponse.data || {};
            return {
              id: line.productId,
              qty: line.quantity,
              price: line.price / line.quantity, // Unit price
              name: product.name || `Product ${line.productId}`,
              imageUrl: product.imageUrl || "",
              description: product.description || "",
              orderLineId: line.id,
            };
          } catch (error) {
            console.error(`Error fetching product ${line.productId}:`, error);
            return {
              id: line.productId,
              qty: line.quantity,
              price: line.price / line.quantity,
              name: `Product ${line.productId}`,
              imageUrl: "",
              description: "Không thể tải thông tin sản phẩm",
              orderLineId: line.id,
            };
          }
        })
      );

      setCart(cartItems);
      setSelectedItems(new Set());
    } catch (error) {
      setMessage(error.message || "Lỗi khi tải giỏ hàng!");
      setTimeout(() => setMessage(""), 3000);
      if (error.message === "Bạn cần đăng nhập!") {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartChange = () => fetchCart();
    const handlePaymentSuccess = () => {
      fetchCart();
      setMessage("Thanh toán thành công!");
      setTimeout(() => setMessage(""), 3000);
    };

    window.addEventListener("cartChanged", handleCartChange);
    window.addEventListener("paymentSuccess", handlePaymentSuccess);

    // Check for redirect from payment success
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("payment") === "success") {
      fetchCart();
      setMessage("Thanh toán thành công!");
      setTimeout(() => setMessage(""), 3000);
    }

    return () => {
      window.removeEventListener("cartChanged", handleCartChange);
      window.removeEventListener("paymentSuccess", handlePaymentSuccess);
    };
  }, [navigate, location]);

  const incrementItem = async (product) => {
    try {
      setLoading(true);
      const userInfo = await ApiService.getMyInfo();
      const userId = userInfo.data.id;
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
      const pendingOrder = ordersResponse.data.find((order) => order.status === "PENDING");

      const orderLineRequest = { productId: product.id, quantity: product.qty + 1 };

      if (!pendingOrder) {
        const orderRequest = {
          userId,
          orderLines: [{ productId: product.id, quantity: 1 }],
          paymentMethod: "CASH_ON_DELIVERY",
        };
        await ApiService.createOrder(orderRequest);
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
        if (existingLine) {
          await ApiService.updateOrderLine(pendingOrder.id, existingLine.id, orderLineRequest);
        } else {
          await ApiService.addOrderLine(pendingOrder.id, orderLineRequest);
        }
      }
      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi tăng số lượng!");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const decrementItem = async (product) => {
    try {
      setLoading(true);
      const userInfo = await ApiService.getMyInfo();
      const userId = userInfo.data.id;
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
      const pendingOrder = ordersResponse.data.find((order) => order.status === "PENDING");

      if (!pendingOrder) return;

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
      if (!orderLine) return;

      if (orderLine.quantity > 1) {
        const orderLineRequest = { productId: product.id, quantity: product.qty - 1 };
        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest);
      } else {
        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id);
      }
      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi giảm số lượng!");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleBuy = () => {
    if (!ApiService.isAuthenticated()) {
      setMessage("Bạn cần đăng nhập trước khi mua hàng!");
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3000);
      return;
    }

    if (selectedItems.size === 0) {
      setMessage("Vui lòng chọn ít nhất một sản phẩm để mua!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const selectedCartItems = cart.filter((item) => selectedItems.has(item.id));
    navigate("/checkout", {
      state: {
        selectedItems: selectedCartItems,
        totalPrice: totalPrice.toFixed(2),
      },
    });
  };

  const totalPrice = cart
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => total + item.price * item.qty, 0);

  const selectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.id)));
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-page">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <span className="cart-icon">🛒</span>
        </div>

        {message && <div className="response-message">{message}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Giỏ hàng của bạn đang trống</p>
            <button className="continue-shopping" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-container">
              <div className="select-all-container">
                <label className="select-all">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cart.length && cart.length > 0}
                    onChange={selectAll}
                    disabled={loading}
                  />
                  <span>Chọn tất cả ({cart.length} sản phẩm)</span>
                </label>
              </div>

              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="item-select">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        id={`select-${item.id}`}
                        disabled={loading}
                      />
                      <label htmlFor={`select-${item.id}`} className="checkbox-custom">
                        {selectedItems.has(item.id) && <span className="checkmark">✓</span>}
                      </label>
                    </div>

                    <div className="item-image">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                      />
                    </div>

                    <div className="item-details">
                      <h2>{item.name}</h2>
                      <p className="item-description">{item.description}</p>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button
                            onClick={() => decrementItem(item)}
                            className="quantity-btn"
                            aria-label="Giảm số lượng"
                            disabled={loading}
                          >
                            <span className="quantity-icon">−</span>
                          </button>
                          <span className="quantity">{item.qty}</span>
                          <button
                            onClick={() => incrementItem(item)}
                            className="quantity-btn"
                            aria-label="Tăng số lượng"
                            disabled={loading}
                          >
                            <span className="quantity-icon">+</span>
                          </button>
                        </div>

                        <div className="item-price">
                          <span className="price-value">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Tổng đơn hàng</h2>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Số lượng sản phẩm đã chọn:</span>
                  <span>{selectedItems.size}</span>
                </div>

                <div className="summary-row subtotal">
                  <span>Tạm tính:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="summary-row shipping">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>

                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                className={`checkout-button ${selectedItems.size === 0 || loading ? "disabled" : ""}`}
                onClick={handleBuy}
                disabled={selectedItems.size === 0 || loading}
              >
                Mua Hàng
              </button>

              <button
                className="continue-shopping"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;