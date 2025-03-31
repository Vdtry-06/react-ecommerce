import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/productDetailsPages.css"

const ProductDetailsPages = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await ApiService.getProduct(productId)
        setProduct(response.data)

        if (ApiService.isAuthenticated()) {
          const userInfo = await ApiService.getMyInfo()
          const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
          const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")

          if (pendingOrder?.orderLines) {
            setCart(
              pendingOrder.orderLines.map((line) => ({
                id: line.productId,
                qty: line.quantity,
                orderLineId: line.id,
              })),
            )
          }
        }
      } catch (error) {
        console.log(error.message || error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    window.addEventListener("cartChanged", fetchData)
    return () => window.removeEventListener("cartChanged", fetchData)
  }, [productId])

  const addToCart = async () => {
    if (!product) return

    try {
      setIsProcessing(true)

      if (!ApiService.isAuthenticated()) {
        const confirmLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?")
        if (confirmLogin) navigate("/login")
        return
      }

      const userInfo = await ApiService.getMyInfo()
      const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")
      const orderLineRequest = { productId: product.id, quantity: 1 }

      if (!pendingOrder) {
        await ApiService.createOrder({
          userId: userInfo.data.id,
          orderLines: [orderLineRequest],
          paymentMethod: "CASH_ON_DELIVERY",
        })
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
        if (existingLine) {
          await ApiService.updateOrderLine(pendingOrder.id, existingLine.id, {
            ...orderLineRequest,
            quantity: existingLine.quantity + 1,
          })
        } else {
          await ApiService.addOrderLine(pendingOrder.id, orderLineRequest)
        }
      }

      window.dispatchEvent(new Event("cartChanged"))
      alert("Sản phẩm đã được thêm vào giỏ hàng!")
    } catch (error) {
      alert("Lỗi khi thêm vào giỏ hàng!")
    } finally {
      setIsProcessing(false)
    }
  }

  const buyNow = async () => {
    try {
      setIsProcessing(true)
      await addToCart()
      navigate("/cart")
    } catch (error) {
      alert("Lỗi khi mua hàng!")
    } finally {
      setIsProcessing(false)
    }
  }

  const updateQuantity = async (increment) => {
    if (!product) return

    try {
      setIsProcessing(true)
      const userInfo = await ApiService.getMyInfo()
      const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")

      if (!pendingOrder) return

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
      if (!orderLine) return

      const newQuantity = orderLine.quantity + (increment ? 1 : -1)

      if (newQuantity > 0) {
        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, {
          productId: product.id,
          quantity: newQuantity,
        })
      } else {
        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
      }

      window.dispatchEvent(new Event("cartChanged"))
    } catch (error) {
      alert(increment ? "Lỗi khi tăng số lượng!" : "Lỗi khi giảm số lượng!")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <div className="loading-container">Đang tải thông tin sản phẩm...</div>
  }

  if (!product) {
    return <div className="error-container">Không tìm thấy sản phẩm</div>
  }

  const cartItem = cart.find((item) => item.id === product.id)

  const relatedProducts = [
    { id: "related1", name: "Sản phẩm liên quan 1", price: 19.99, imageUrl: "/placeholder.svg?height=150&width=150" },
    { id: "related2", name: "Sản phẩm liên quan 2", price: 24.99, imageUrl: "/placeholder.svg?height=150&width=150" },
    { id: "related3", name: "Sản phẩm liên quan 3", price: 29.99, imageUrl: "/placeholder.svg?height=150&width=150" },
    { id: "related4", name: "Sản phẩm liên quan 4", price: 34.99, imageUrl: "/placeholder.svg?height=150&width=150" },
  ]

  return (
    <div className="product-details-container">
      <div className="product-detail-top">
        <div className="product-image-section">
          <div className="product-image-container">
            <img src={product.imageUrl || "/placeholder.svg?height=300&width=300"} alt={product.name} />
            {product.discount > 0 && <div className="discount-badge">-{product.discount}%</div>}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="product-price">
            <span className="current-price">${product.price?.toFixed(2)}</span>
            {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
          </div>

          <div className="product-availability">
            <span
              className={`availability-indicator ${product.availableQuantity > 0 ? "in-stock" : "out-of-stock"}`}
            ></span>
            <span className="availability-text">
              {product.availableQuantity > 0 ? `Còn hàng (${product.availableQuantity})` : "Hết hàng"}
            </span>
          </div>

          {cartItem ? (
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(false)} disabled={isProcessing}>
                -
              </button>
              <span>{isProcessing ? "..." : cartItem.qty}</span>
              <button onClick={() => updateQuantity(true)} disabled={isProcessing}>
                +
              </button>
            </div>
          ) : (
            <div className="product-buttons">
              <button
                className="add-to-cart-button"
                onClick={addToCart}
                disabled={isProcessing || product.availableQuantity <= 0}
              >
                {isProcessing ? "Đang xử lý..." : "Thêm vào giỏ"}
              </button>
              <button
                className="buy-now-button"
                onClick={buyNow}
                disabled={isProcessing || product.availableQuantity <= 0}
              >
                {isProcessing ? "Đang xử lý..." : "Mua ngay"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="product-detail-content">
        <div className="product-tabs">
          <button
            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`tab-button ${activeTab === "specifications" ? "active" : ""}`}
            onClick={() => setActiveTab("specifications")}
          >
            Thông số kỹ thuật
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div className="product-description">
              <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
              <div className="product-features">
                <h3>Đặc điểm sản phẩm</h3>
                <ul>
                  <li>Thương hiệu: {product.brand || "Chưa cập nhật"}</li>
                  <li>Xuất xứ: {product.origin || "Chưa cập nhật"}</li>
                  <li>Trọng lượng: {product.weight || "Chưa cập nhật"}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="product-specifications">
              <h2>Thông số kỹ thuật</h2>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Mã sản phẩm</td>
                    <td>{product.id || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Kích thước</td>
                    <td>{product.dimensions || "Chưa cập nhật"}</td>
                  </tr>
                  <tr>
                    <td>Chất liệu</td>
                    <td>{product.material || "Chưa cập nhật"}</td>
                  </tr>
                  <tr>
                    <td>Bảo hành</td>
                    <td>{product.warranty || "Chưa cập nhật"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="customer-reviews-section">
        <h2>Đánh giá từ khách hàng</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <div className="rating-number">4.7</div>
            <div className="rating-stars">★★★★★</div>
            <div className="total-reviews">3 đánh giá</div>
          </div>
        </div>
      </div>

      <div className="related-products-section">
        <h2>Sản phẩm liên quan</h2>
        <div className="related-products-grid">
          {relatedProducts.map((product) => (
            <div className="related-product-card" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <div className="related-product-image">
                <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} />
              </div>
              <div className="related-product-info">
                <h3>{product.name}</h3>
                <div className="related-product-price">
                  <span className="current-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPages

