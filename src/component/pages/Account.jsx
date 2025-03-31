import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import Pagination from "../common/Pagination"
import "../../static/style/account.css"

const Account = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getMyInfo()
      setUserInfo(response.data)
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to fetch user info")
    }
  }

  if (!userInfo) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const handleAddressClick = () => {
    navigate(userInfo.address ? "/edit-address" : "/add-address", { state: { returnUrl: "/account" } })
  }

  const orderItemList = userInfo.orders || []
  const totalPages = Math.ceil(orderItemList.length / itemsPerPage)
  const paginatedOrders = orderItemList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="header-content">
          <div className="profile-image-wrapper">
            <img src={userInfo.imageUrl} alt={userInfo.username} className="profile-image" />
          </div>
          <div className="user-intro">
            <h1>Xin chào, {userInfo.username}</h1>
            <p>{userInfo.email}</p>
          </div>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="account-sections">
        <div className="personal-info section">
          <h2>Thông tin cá nhân</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tên</span>
              <span className="info-value">{userInfo.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Họ</span>
              <span className="info-value">{userInfo.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày sinh</span>
              <span className="info-value">{userInfo.dateOfBirth}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{userInfo.email}</span>
            </div>
          </div>
        </div>

        <div className="address-section section">
          <h2>Thông tin địa chỉ</h2>
          {userInfo.address ? (
            <div className="info-grid">

              <div className="info-item">
                <span className="info-label">Số nhà</span>
                <span className="info-value">{userInfo.address.houseNumber}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Đường</span>
                <span className="info-value">{userInfo.address.street}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Phường</span>
                <span className="info-value">{userInfo.address.ward}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Quận</span>
                <span className="info-value">{userInfo.address.district}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Thành phố</span>
                <span className="info-value">{userInfo.address.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Quốc gia</span>
                <span className="info-value">{userInfo.address.country}</span>
              </div>
            </div>
          ) : (
            <p className="no-address">Chưa có thông tin địa chỉ</p>
          )}
          <button className="address-action-btn" onClick={handleAddressClick}>
            {userInfo.address ? "Sửa địa chỉ" : "Thêm địa chỉ"}
          </button>
        </div>

        <div className="order-history section">
          <h2>Lịch sử đặt hàng</h2>
          {paginatedOrders.length === 0 ? (
            <p className="no-orders">Chưa có đơn hàng nào</p>
          ) : (
            <div className="order-list">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="order-card">
                  {order.orderLines.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="order-item-details">
                        <span className="order-product-name">{item.name}</span>
                        <span className="order-product-quantity">Số lượng: {item.quantity}</span>
                      </div>
                      <span className="order-product-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {paginatedOrders.length > 0 && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Account