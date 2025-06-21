import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "../../../static/style/cart.css";
import Notification from "../../common/Notification";
import ApiService from "../../../service/ApiService";

const CartPage = () => {
  const { cart, syncCartWithBackend, isLoading } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [, setLoading] = useState(isLoading);
  const [toppingPrices, setToppingPrices] = useState({});
  const [toppingNames, setToppingNames] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const incrementItem = async (product) => {
    try {
      setLoading(true);
      showNotification("Đang tăng số lượng...", "info");
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;

      await syncCartWithBackend(userId, "INCREMENT_ITEM", product);
      showNotification("Tăng số lượng thành công", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Lỗi khi tăng số lượng!", "error");
    } finally {
      setLoading(false);
    }
  };

  const decrementItem = async (product) => {
    try {
      setLoading(true);
      showNotification("Đang giảm số lượng...", "info");
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;

      await syncCartWithBackend(userId, "DECREMENT_ITEM", product);
      showNotification("Giảm số lượng thành công", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Lỗi khi giảm số lượng!", "error");
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
      showNotification("Bạn cần đăng nhập trước khi mua hàng!", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (selectedItems.size === 0) {
      showNotification("Vui lòng chọn ít nhất một sản phẩm để mua!", "error");
      return;
    }

    const selectedCartItems = cart.filter((item) => selectedItems.has(item.id)).map((item) => ({
      ...item,
      toppingNames,
      toppingPrices,
    }));
    navigate("/checkout", {
      state: {
        selectedItems: selectedCartItems,
        totalPrice: totalPrice.toFixed(2),
      },
    });
  };

  const fetchToppingInfo = async (toppingId) => {
    try {
      const response = await ApiService.Topping.getTopping(toppingId);
      setToppingPrices((prev) => ({
        ...prev,
        [toppingId]: response.data.price || 0,
      }));
      setToppingNames((prev) => ({
        ...prev,
        [toppingId]: response.data.name || `Topping ${toppingId}`,
      }));
    } catch (error) {
      console.error(`Error fetching info for topping ${toppingId}:`, error);
      setToppingPrices((prev) => ({
        ...prev,
        [toppingId]: 0,
      }));
      setToppingNames((prev) => ({
        ...prev,
        [toppingId]: `Topping ${toppingId} (Lỗi)`,
      }));
    }
  };

  const calculateItemTotal = (item) => {
    if (!toppingPrices || !item.toppingIds) return item.price * item.quantity;

    const toppingTotal = item.toppingIds.reduce((sum, toppingId) => {
      return sum + (toppingPrices[toppingId] || 0);
    }, 0);

    return (item.price + toppingTotal) * item.qty;
  };

  const totalPrice = cart
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => total + calculateItemTotal(item), 0);

  const selectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.id)));
    }
  };

  useEffect(() => {
    const fetchAllToppingInfo = async () => {
      const uniqueToppingIds = new Set(
        cart.flatMap((item) => item.toppingIds || [])
      );
      for (const toppingId of uniqueToppingIds) {
        if (!toppingPrices[toppingId] || !toppingNames[toppingId]) {
          await fetchToppingInfo(toppingId);
        }
      }
    };

    if (cart.length > 0) {
      fetchAllToppingInfo();
    }
  }, [cart, toppingPrices, toppingNames]);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      showNotification("Thanh toán thành công!", "success");
    };

    window.addEventListener("paymentSuccess", handlePaymentSuccess);

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("payment") === "success") {
      showNotification("Thanh toán thành công!", "success");
    }

    return () => {
      window.removeEventListener("paymentSuccess", handlePaymentSuccess);
    };
  }, [navigate, location]);

  return (
    <div className="cart-container">
      <div className="cart-page">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <span className="cart-icon">🛒</span>
        </div>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>{notification?.message || "Giỏ hàng của bạn đang trống"}</p>
            <button className="continue-shopping" onClick={() => navigate("/")} disabled={isLoading}>
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
                    disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <label htmlFor={`select-${item.id}`} className="checkbox-custom">
                        {selectedItems.has(item.id) && <span className="checkmark">✓</span>}
                      </label>
                    </div>

                    <div className="item-image">
                      <img
                        src={item.productImageUrl || "/placeholder.svg?height=100&width=100"}
                        alt={item.productName}
                      />
                    </div>

                    <div className="item-details">
                      <h2>{item.productName}</h2>
                      <p className="item-description">{item.description || "Không có mô tả"}</p>
                      <p className="item-description">Giá: {item.price}</p>
                      {item.toppingIds && item.toppingIds.length > 0 && (
                        <div className="toppings-list">
                          <h3 className="toppings-title">Toppings</h3>
                          <ul className="topping-items">
                            {item.toppingIds.map((toppingId) => (
                              <li key={toppingId} className="topping-item">
                                <span className="topping-name">
                                  {toppingNames[toppingId] || `Topping ${toppingId}`}
                                </span>
                                <span className="topping-price">
                                  {(toppingPrices[toppingId]?.toFixed(2) || 0)} VNĐ
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button
                            onClick={() => decrementItem(item)}
                            className="quantity-btn"
                            aria-label="Giảm số lượng"
                            disabled={isLoading}
                          >
                            <span className="quantity-icon">−</span>
                          </button>
                          <span className="quantity">{item.qty}</span>
                          <button
                            onClick={() => incrementItem(item)}
                            className="quantity-btn"
                            aria-label="Tăng số lượng"
                            disabled={isLoading}
                          >
                            <span className="quantity-icon">+</span>
                          </button>
                        </div>

                        <div className="item-price">
                          <span className="price-value">{calculateItemTotal(item).toFixed(2)} VNĐ</span>
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
                  <span>{totalPrice.toFixed(2)} VNĐ</span>
                </div>

                <div className="summary-row shipping">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>

                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{totalPrice.toFixed(2)} VNĐ</span>
                </div>
              </div>

              <button
                className={`checkout-button ${selectedItems.size === 0 || isLoading ? "disabled" : ""}`}
                onClick={handleBuy}
                disabled={selectedItems.size === 0 || isLoading}
              >
                Mua Hàng
              </button>

              <button
                className="continue-shopping"
                onClick={() => navigate("/")}
                disabled={isLoading}
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