import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../auth/context/CartContext";
import ApiService from "../../../service/ApiService";
import CartHeader from "../../../components/user/cart/CartHeader";
import CartNotification from "../../../components/user/cart/CartNotification";
import CartItems from "../../../components/user/cart/CartItems";
import CartSummary from "../../../components/user/cart/CartSummary";
import "../../../static/style/cart.css";

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
      showNotification(
        error.response?.data?.message || "Lỗi khi tăng số lượng!",
        "error"
      );
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
      showNotification(
        error.response?.data?.message || "Lỗi khi giảm số lượng!",
        "error"
      );
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

    const selectedCartItems = cart
      .filter((item) => selectedItems.has(item.id))
      .map((item) => ({
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
        <CartHeader />
        <CartNotification notification={notification} onClose={() => setNotification(null)} />
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>{notification?.message || "Giỏ hàng của bạn đang trống"}</p>
            <button
              className="continue-shopping"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <CartItems
              cart={cart}
              selectedItems={selectedItems}
              toggleSelectItem={toggleSelectItem}
              incrementItem={incrementItem}
              decrementItem={decrementItem}
              calculateItemTotal={calculateItemTotal}
              toppingPrices={toppingPrices}
              toppingNames={toppingNames}
              isLoading={isLoading}
              selectAll={selectAll}
            />
            <CartSummary
              selectedItems={selectedItems}
              totalPrice={totalPrice}
              handleBuy={handleBuy}
              isLoading={isLoading}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;