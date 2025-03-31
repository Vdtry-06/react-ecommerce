"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/checkout.css"

const CheckoutPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [selectedItems, setSelectedItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [userAddress, setUserAddress] = useState(null)
  const [message, setMessage] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(true)

  useEffect(() => {
    if (state) {
      setSelectedItems(state.selectedItems || [])
      setTotalPrice(state.totalPrice || 0)
    }
    fetchUserAddress()

    // Xử lý callback từ VNPay
    const urlParams = new URLSearchParams(window.location.search)
    const vnpResponseCode = urlParams.get("vnp_ResponseCode")
    if (vnpResponseCode) {
      handleVNPayCallback(vnpResponseCode)
    }
  }, [state])

  const fetchUserAddress = async () => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const addressId = userInfo.data.address?.id
      if (addressId) {
        const response = await ApiService.getAddress(addressId)
        setUserAddress(response.data)
      } else {
        setUserAddress(null)
        setMessage("Chưa có địa chỉ. Vui lòng cập nhật địa chỉ!")
      }
    } catch (error) {
      console.error("Error fetching user address:", error)
      setUserAddress(null)
      setMessage("Không thể tải địa chỉ. Vui lòng cập nhật địa chỉ!")
    } finally {
      setLoadingAddress(false)
    }
  }

  const handleUpdateAddress = () => {
    navigate("/edit-address", { state: { returnUrl: "/checkout", checkoutState: state } })
  }

  const handleConfirmCheckout = async () => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id

      const selectedOrderLines = selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        price: item.price * item.qty,
      }))

      const response = await ApiService.createVNPayPaymentForSelectedItems({
        orderLines: selectedOrderLines,
        userId: userId,
        bankCode: "NCB",
      })

      if (response.data.code === "ok") {
        window.location.href = response.data.paymentUrl
      } else {
        setMessage("Lỗi khi tạo thanh toán VNPay!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi khi thanh toán!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleVNPayCallback = async (responseCode) => {
    try {
      if (responseCode === "00") {
        setMessage("Thanh toán thành công!")
        await removePaidItemsFromPendingOrder()
        setTimeout(() => {
          setMessage("")
          navigate("/")
        }, 3000)
      } else {
        setMessage("Thanh toán thất bại!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Lỗi khi xử lý callback từ VNPay!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const removePaidItemsFromPendingOrder = async () => {
    try {
      const userInfo = await ApiService.getMyInfo()
      const userId = userInfo.data.id
      const ordersResponse = await ApiService.getAllOrdersOfUser(userId)
      const orders = ordersResponse.data || []
      const pendingOrder = orders.find((order) => order.status === "PENDING")

      if (pendingOrder) {
        for (const item of selectedItems) {
          const orderLine = pendingOrder.orderLines.find((line) => line.productId === item.id)
          if (orderLine) {
            await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
          }
        }
        window.dispatchEvent(new Event("cartChanged"))
      }
    } catch (error) {
      console.error("Error removing paid items from pending order:", error)
    }
  }

  if (!state || selectedItems.length === 0) {
    return <p>Không có sản phẩm nào để thanh toán. Vui lòng quay lại giỏ hàng!</p>
  }

  return (
    <div className="checkout-page">
      <h1>Xác nhận đơn hàng</h1>
      {message && <div className={`response-message ${message.includes("thành công") ? "success" : "error"}`}>{message}</div>}

      <div className="checkout-details">
        <h2>Sản phẩm đã chọn</h2>
        <ul>
          {selectedItems.map((item) => (
            <li key={item.id}>
              {item.name} - Số lượng: {item.qty} - Giá: ${(item.price * item.qty).toFixed(2)}
            </li>
          ))}
        </ul>

        <h2>Địa chỉ giao hàng</h2>
        {loadingAddress ? (
          <p>Đang tải địa chỉ...</p>
        ) : userAddress ? (
          <p>
            {userAddress.houseNumber} {userAddress.street}, {userAddress.ward}, {userAddress.district}, {userAddress.city}, {userAddress.country}
          </p>
        ) : (
          <p>Chưa có địa chỉ. Vui lòng cập nhật!</p>
        )}
        <button onClick={handleUpdateAddress} className="update-address-button">
          Cập nhật địa chỉ
        </button>

        <h2>Tổng tiền: ${totalPrice}</h2>

        <button onClick={handleConfirmCheckout} className="confirm-checkout-button">
          Xác nhận thanh toán
        </button>
        <button onClick={() => navigate("/cart")} className="cancel-button">
          Hủy
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage