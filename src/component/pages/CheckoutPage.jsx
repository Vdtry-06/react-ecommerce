import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/checkout.css";
import "../../static/style/cart.css";

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
      setTotalPrice(sourceState.totalPrice || 0);
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
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;

      const selectedOrderLines = selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        price: item.price * item.qty,
      }));

      const response = await ApiService.Payment.createVNPayPaymentForSelectedItems({
        orderLines: selectedOrderLines,
        userId: userId,
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
        setTimeout(() => setMessage(""), 3000);
        await removePaidItemsFromPendingOrder();
        setTimeout(() => {
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

  const removePaidItemsFromPendingOrder = async () => {
    try {
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userId);
      const orders = ordersResponse.data || [];
      const pendingOrder = orders.find((order) => order.status === "PENDING");

      if (pendingOrder) {
        for (const item of selectedItems) {
          const orderLine = pendingOrder.orderLines.find((line) => line.productId === item.id);
          if (orderLine) {
            await ApiService.Order.deleteOrderLine(pendingOrder.id, orderLine.id);
          }
        }
        window.dispatchEvent(new Event("cartChanged"));
      }
    } catch (error) {
      console.error("Error removing paid items from pending order:", error);
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
              {selectedItems.map((item) => (
                <li key={item.id} className="checkout-item">
                  <div className="item-image dif">
                    <img
                      src={item.imageUrl || "/placeholder.svg?height=100&width=100"}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details dif">
                    <h2 style={{ color: "#9e7b14" }}>{item.name}</h2>
                    <div className="item-actions dif">
                      <div className="quantity-controls">
                        <span className="quantity">Số lượng: {item.qty}</span>
                      </div>
                      <div className="item-price">
                        <span className="price-value" style={{ color: "#e0a800" }}>
                          Giá: {(item.price * item.qty).toFixed(2)} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
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
              <p  style={{ color: "#52c41a" }}>
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
                <span>{totalPrice} VNĐ</span>
              </div>
              <div className="summary-row shipping">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{totalPrice} VNĐ</span>
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