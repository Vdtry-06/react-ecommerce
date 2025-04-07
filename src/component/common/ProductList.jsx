import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/productList.css"

const ProductList = ({ products }) => {
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [processingItem, setProcessingItem] = useState(null)

  const fetchCart = async () => {
    try {
      if (ApiService.isAuthenticated()) {
        const userInfo = await ApiService.getMyInfo()
        const userId = userInfo.data.id
        const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
        const orders = ordersResponse.data || []
        const pendingOrder = orders.find((order) => order.status === "PENDING")

        if (pendingOrder && pendingOrder.orderLines) {
          const cartItems = pendingOrder.orderLines.map((line) => ({
            id: line.productId,
            qty: line.quantity,
            orderLineId: line.id,
          }))
          setCart(cartItems)
        } else {
          setCart([])
        }
      } else {
        setCart([])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCart([])
    }
  }

  const getPendingOrder = async () => {
    try {
      if (!ApiService.isAuthenticated()) {
        return null
      }
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      return orders.find((order) => order.status === "PENDING")
    } catch (error) {
      console.error("Error fetching pending order:", error)
      return null
    }
  }

  const addToCart = async (product) => {
    try {
      setProcessingItem(product.id)

      if (!ApiService.isAuthenticated()) {
        const confirmLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?")
        if (confirmLogin) {
          window.location.href = "/login"
        }
        setProcessingItem(null)
        return
      }

      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const pendingOrder = await getPendingOrder()

      const orderLineRequest = { productId: product.id, quantity: 1 }

      if (!pendingOrder) {
        const orderRequest = {
          userId,
          orderLines: [orderLineRequest],
          paymentMethod: "CASH_ON_DELIVERY",
        }
        await ApiService.createOrder(orderRequest)
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
        if (existingLine) {
          await ApiService.updateOrderLine(pendingOrder.id, existingLine.id, {
            productId: product.id,
            quantity: existingLine.quantity + 1,
          })
        } else {
          await ApiService.addOrderLine(pendingOrder.id, orderLineRequest)
        }
      }

      window.dispatchEvent(new Event("cartChanged"))
      await fetchCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!")
    } finally {
      setProcessingItem(null)
    }
  }

  const incrementItem = async (product) => {
    try {
      setProcessingItem(product.id)
      const pendingOrder = await getPendingOrder()
      if (!pendingOrder) return

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
      if (!orderLine) return

      const orderLineRequest = { productId: product.id, quantity: orderLine.quantity + 1 }
      await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest)

      window.dispatchEvent(new Event("cartChanged"))
      await fetchCart()
    } catch (error) {
      console.error("Error incrementing item:", error)
      alert(error.response?.data?.message || "Lỗi khi tăng số lượng!")
    } finally {
      setProcessingItem(null)
    }
  }

  const decrementItem = async (product) => {
    try {
      setProcessingItem(product.id)
      const pendingOrder = await getPendingOrder()
      if (!pendingOrder) return

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
      if (!orderLine) return

      if (orderLine.quantity > 1) {
        const orderLineRequest = { productId: product.id, quantity: orderLine.quantity - 1 }
        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest)
      } else {
        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
      }

      window.dispatchEvent(new Event("cartChanged"))
      await fetchCart()
    } catch (error) {
      console.error("Error decrementing item:", error)
      alert(error.response?.data?.message || "Lỗi khi giảm số lượng!")
    } finally {
      setProcessingItem(null)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchCart().finally(() => setIsLoading(false))

    const handleCartUpdate = () => fetchCart()
    window.addEventListener("cartChanged", handleCartUpdate)

    return () => {
      window.removeEventListener("cartChanged", handleCartUpdate)
    }
  }, [])

  console.log("Product List Render:", products)

  return (
    <div className="product-list">
      {products.map((product, index) => {
        const cartItem = cart.find((item) => item.id === product.id)
        const isProcessing = processingItem === product.id

        return (
          <div className="product-item" key={index}>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>${product.price.toFixed(2)}</span>
            </Link>
            {cartItem ? (
              <div className="quantity-controls">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    decrementItem(product)
                  }}
                  disabled={isProcessing}
                >
                  -
                </button>
                <span>{isProcessing ? "..." : cartItem.qty}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    incrementItem(product)
                  }}
                  disabled={isProcessing}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(product)
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang thêm..." : "Add to Cart"}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProductList

