import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";
import "../../../static/style/checkout.css";
import "../../../static/style/cart.css";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userAddress, setUserAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    if (state) {
      const sourceState = state.checkoutState || state;
      setSelectedItems(sourceState.selectedItems || []);
      const calculatedTotal = sourceState.selectedItems.reduce((sum, item) => {
        const toppingTotal = item.toppingIds.reduce((toppingSum, toppingId) => {
          return toppingSum + (item.toppingPrices?.[toppingId] || 0);
        }, 0);
        return sum + (item.price + toppingTotal) * item.qty;
      }, 0);
      setTotalPrice(calculatedTotal || 0);
    }
    fetchUserAddress();

    const urlParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");
    if (vnpResponseCode) {
      handleVNPayCallback(vnpResponseCode);
    }
  }, [state]);

  const fetchUserAddress = async () => {
    try {
      const userInfo = await ApiService.User.getMyInfo();
      const addressId = userInfo.data.address?.id;
      if (addressId) {
        const response = await ApiService.Address.getAddress(addressId);
        setUserAddress(response.data);
      } else {
        setUserAddress(null);
        setMessage("Chưa có địa chỉ. Vui lòng cập nhật địa chỉ!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setUserAddress(null);
      setMessage("Không thể tải địa chỉ. Vui lòng cập nhật địa chỉ!");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleUpdateAddress = () => {
    const path = userAddress ? "/edit-address" : "/add-address";
    navigate(path, {
      state: {
        returnUrl: "/checkout",
        checkoutState: { selectedItems, totalPrice },
      },
    });
  };

  const handleConfirmCheckout = async () => {
    try {
      if (!ApiService.isAuthenticated()) {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
          localStorage.setItem("postLoginRedirect", "/checkout");
          localStorage.setItem("state", JSON.stringify({ selectedItems, totalPrice }));
          navigate("/login");
          return;
        }
        setMessage("Bạn cần đăng nhập để thanh toán!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const selectedProductIds = selectedItems.map((item) => item.id);
      const response = await ApiService.Payment.createVNPayPaymentForSelectedItems({
        userId,
        selectedProductIds,
        bankCode: "NCB",
      });

      if (response.data.code === "ok") {
        window.location.href = response.data.paymentUrl;
      } else {
        setMessage("Lỗi khi tạo thanh toán VNPay!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi thanh toán!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleVNPayCallback = async (responseCode) => {
    try {
      if (responseCode === "00") {
        setMessage("Thanh toán thành công!");
        window.dispatchEvent(new Event("cartChanged"));
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 3000);
      } else {
        setMessage("Thanh toán thất bại!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Lỗi khi xử lý callback từ VNPay!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!state || selectedItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-page">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Bạn vừa hủy thanh toán. Vui lòng quay lại giỏ hàng!</p>
            <button className="continue-shopping" onClick={() => navigate("/cart")}>
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {message && <div className="response-message">{message}</div>}
      <div className="cart-page">
        <div className="cart-header">
          <h1>Xác nhận đơn hàng</h1>
          <span className="checkout-icon">🛒</span>
        </div>

        <div className="cart-content">
          <div className="checkout-items-container">
            <ul className="cart-items">
              {selectedItems.map((item) => {
                const toppingTotal = item.toppingIds.reduce((sum, toppingId) => {
                  return sum + (item.toppingPrices?.[toppingId] || 0);
                }, 0);
                const itemTotal = (item.price + toppingTotal) * item.qty;
                return (
                  <li key={item.productId} className="checkout-item">
                    <div className="item-image dif">
                      <img
                        src={item.productImageUrl || "/placeholder.svg?height=100&width=100"}
                        alt={item.productName}
                      />
                    </div>
                    <div className="item-details dif">
                      <h2 style={{ color: "#9e7b14" }}>{item.productName}</h2>
                      <p className="item-description">{item.description || "Không có mô tả"}</p>
                      {item.toppingIds && item.toppingIds.length > 0 && (
                        <div className="toppings-list">
                          <h3 className="toppings-title">Toppings</h3>
                          <ul className="topping-items">
                            {item.toppingIds.map((toppingId) => (
                              <li key={toppingId} className="topping-item">
                                <span className="topping-name">
                                  {item.toppingNames?.[toppingId] || `Topping ${toppingId}`}
                                </span>
                                <span className="topping-price">
                                  {(item.toppingPrices?.[toppingId] || 0).toFixed(2)} VNĐ
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="item-actions dif">
                        <div className="quantity-controls">
                          Số lượng: <span className="quantity">{item.qty}</span>
                        </div>
                        <div className="item-price">
                          <span className="price-value" style={{ color: "#e0a800" }}>
                            Tổng: {itemTotal.toFixed(2)} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h2>Địa chỉ giao hàng</h2>
            </div>
            {loadingAddress ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải địa chỉ...</p>
              </div>
            ) : userAddress ? (
              <p style={{ color: "#52c41a" }}>
                {userAddress.houseNumber} {userAddress.street}, {userAddress.ward},{" "}
                {userAddress.district}, {userAddress.city}, {userAddress.country}
              </p>
            ) : (
              <p>Chưa có địa chỉ. Vui lòng cập nhật!</p>
            )}
            <button
              className="continue-shopping update-address-btn"
              onClick={handleUpdateAddress}
            >
              Cập nhật địa chỉ
            </button>

            <div className="summary-header">
              <h2>Tổng đơn hàng</h2>
            </div>
            <div className="summary-details">
              <div className="summary-row">
                <span>Số lượng sản phẩm đã chọn:</span>
                <span>{selectedItems.length}</span>
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

            <button className="checkout-button dif" onClick={handleConfirmCheckout}>
              Xác nhận thanh toán
            </button>
            <button className="checkout-button dif" onClick={() => navigate("/orders-status")}>
              Thanh toán khi nhận hàng
            </button>
            <button className="continue-shopping" onClick={() => navigate("/cart")}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;