import React from "react";

const CartSummary = ({ selectedItems, totalPrice, handleBuy, isLoading, navigate }) => {
  return (
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
  );
};

export default CartSummary;