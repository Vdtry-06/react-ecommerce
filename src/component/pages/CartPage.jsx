"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/cart.css"

const CartPage = () => {
  const [cart, setCart] = useState([]) // Giỏ hàng từ backend
  const [selectedItems, setSelectedItems] = useState(new Set()) // Các sản phẩm được tích chọn
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Hàm lấy giỏ hàng từ backend
  const fetchCart = async () => {
    try {
      if (!ApiService.isAuthenticated()) {
        throw new Error("Bạn cần đăng nhập!")
      }
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      const pendingOrder = orders.find((order) => order.status === "PENDING") || { orderLines: [] }

      const cartItems = await Promise.all(
        pendingOrder.orderLines.map(async (line) => {
          try {
            const productResponse = await ApiService.getProduct(line.productId)
            const product = productResponse.data || {}
            return {
              id: line.productId,
              qty: line.quantity,
              price: line.price / line.quantity, // Giả sử price là tổng giá
              name: product.name || `Product ${line.productId}`,
              imageUrl: product.imageUrl || "",
              description: product.description || "",
              orderLineId: line.id, // Lưu ID của orderLine để dùng khi thanh toán/xóa
            }
          } catch (error) {
            console.error(`Error fetching product ${line.productId}:`, error)
            return {
              id: line.productId,
              qty: line.quantity,
              price: line.price / line.quantity,
              name: `Product ${line.productId}`,
              imageUrl: "",
              description: "Không thể tải thông tin sản phẩm",
              orderLineId: line.id,
            }
          }
        }),
      )
      setCart(cartItems)
    } catch (error) {
      setMessage(error.message || "Lỗi khi tải giỏ hàng!")
      setTimeout(() => setMessage(""), 3000)
      if (error.message === "Bạn cần đăng nhập!") {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  // Gọi fetchCart khi component mount
  useEffect(() => {
    fetchCart()
    window.addEventListener("cartChanged", fetchCart)
    return () => window.removeEventListener("cartChanged", fetchCart)
  }, [navigate])

  const incrementItem = async (product) => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      const pendingOrder = orders.find((order) => order.status === "PENDING")

      if (!pendingOrder) {
        const orderRequest = {
          userId,
          orderLines: [{ productId: product.id, quantity: 1 }],
          paymentMethod: "CASH_ON_DELIVERY",
        }
        await ApiService.createOrder(orderRequest)
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
        const orderLineRequest = { productId: product.id, quantity: product.qty + 1 }
        if (existingLine) {
          await ApiService.updateOrderLine(pendingOrder.id, existingLine.id, orderLineRequest)
        } else {
          await ApiService.addOrderLine(pendingOrder.id, orderLineRequest)
        }
      }
      window.dispatchEvent(new Event("cartChanged"))
      fetchCart()
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi tăng số lượng!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const decrementItem = async (product) => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      const pendingOrder = orders.find((order) => order.status === "PENDING")
      if (!pendingOrder) return

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
      if (!orderLine) return

      if (orderLine.quantity > 1) {
        const orderLineRequest = { productId: product.id, quantity: product.qty - 1 }
        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest)
      } else {
        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
      }
      window.dispatchEvent(new Event("cartChanged"))
      fetchCart()
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi giảm số lượng!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev)
      if (newSelected.has(productId)) {
        newSelected.delete(productId)
      } else {
        newSelected.add(productId)
      }
      return newSelected
    })
  }

  const handleCheckout = async () => {
    if (!ApiService.isAuthenticated()) {
      setMessage("Bạn cần đăng nhập trước khi thanh toán!")
      setTimeout(() => {
        setMessage("")
        navigate("/login")
      }, 3000)
      return
    }

    if (selectedItems.size === 0) {
      setMessage("Vui lòng chọn ít nhất một sản phẩm để thanh toán!")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      const pendingOrder = orders.find((order) => order.status === "PENDING")

      if (!pendingOrder || pendingOrder.orderLines.length === 0) {
        setMessage("Giỏ hàng trống!")
        setTimeout(() => setMessage(""), 3000)
        return
      }

      // Lọc các sản phẩm được chọn
      const selectedCartItems = cart.filter((item) => selectedItems.has(item.id))
      const orderRequest = {
        userId,
        orderLines: selectedCartItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
        paymentMethod: "CASH_ON_DELIVERY",
      }
      await ApiService.createOrder(orderRequest)

      // Xóa các sản phẩm đã thanh toán khỏi đơn hàng PENDING
      for (const item of selectedCartItems) {
        const orderLine = pendingOrder.orderLines.find((line) => line.productId === item.id)
        if (orderLine) {
          await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
        }
      }

      setMessage("Thanh toán thành công!")
      setSelectedItems(new Set()) // Reset các sản phẩm được chọn
      setTimeout(() => {
        setMessage("")
        fetchCart() // Cập nhật lại giỏ hàng
      }, 3000)
      window.dispatchEvent(new Event("cartChanged"))
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi thanh toán!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  // Tính tổng giá của các sản phẩm được chọn
  const totalPrice = cart
    .filter((item) => selectedItems.has(item.id))
    .reduce((total, item) => total + item.price * item.qty, 0)

  const selectAll = () => {
    if (selectedItems.size === cart.length) {
      // If all items are selected, deselect all
      setSelectedItems(new Set())
    } else {
      // Otherwise, select all items
      setSelectedItems(new Set(cart.map((item) => item.id)))
    }
  }

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
            <button className="continue-shopping" onClick={() => navigate("/products")}>
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
                      />
                      <label htmlFor={`select-${item.id}`} className="checkbox-custom">
                        {selectedItems.has(item.id) && <span className="checkmark">✓</span>}
                      </label>
                    </div>

                    <div className="item-image">
                      <img src={item.imageUrl || "/placeholder.svg?height=100&width=100"} alt={item.name} />
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
                          >
                            <span className="quantity-icon">−</span>
                          </button>
                          <span className="quantity">{item.qty}</span>
                          <button
                            onClick={() => incrementItem(item)}
                            className="quantity-btn"
                            aria-label="Tăng số lượng"
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
                className={`checkout-button ${selectedItems.size === 0 ? "disabled" : ""}`}
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
              >
                Thanh toán ngay
              </button>

              <button className="continue-shopping" onClick={() => navigate("/products")}>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
