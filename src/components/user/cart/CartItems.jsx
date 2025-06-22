import React from "react";

const CartItems = ({
  cart,
  selectedItems,
  toggleSelectItem,
  incrementItem,
  decrementItem,
  calculateItemTotal,
  toppingPrices,
  toppingNames,
  isLoading,
  selectAll,
}) => {
  return (
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
                  <span className="price-value">
                    {calculateItemTotal(item).toFixed(2)} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItems;