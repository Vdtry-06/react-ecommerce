import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/orders.css"

const OrdersPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const response = await ApiService.getAllOrdersOfUser(userId)

      const paidOrders = response.data.filter(order => order.status === "PAID")
      setOrders(paidOrders)
    } catch (err) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại!")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Đang tải đơn hàng...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (orders.length === 0) {
    return <p>Bạn chưa có đơn hàng nào đã thanh toán.</p>
  }

  return (
    <div className="orders-page">
      <h1>Đơn hàng của tôi</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <h2>Đơn hàng #{order.id}</h2>
            <p>Trạng thái: <span className={order.status.toLowerCase()}>{order.status}</span></p>
            <p>Tổng tiền: ${order.totalPrice.toFixed(2)}</p>
            <ul>
              {order.orderLines.map((line) => (
                <li key={line.id}>
                  Sản phẩm #{line.productId} - Số lượng: {line.quantity} - Giá: ${line.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")} className="back-button">
        Quay lại trang chủ
      </button>
    </div>
  )
}

export default OrdersPage