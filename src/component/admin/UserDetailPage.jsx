import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const UserDetailPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        fetchUserInfo(userId);
    }, [userId]);

    const fetchUserInfo = async (id) => {
        try {
            const response = await ApiService.getUserInfoById(id);
            console.log("User info response:", response);
            setUser(response.data);
            setMessage("");
        } catch (error) {
            console.error("Error fetching user info:", error);
            setMessage(error.response?.data?.message || "Failed to fetch user details");
        }
    };

    if (!user) {
        return (
            <div className="admin-product-list">
                <p className="no-data">Loading...</p>
            </div>
        );
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = user.orders ? user.orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];
    const totalPages = user.orders ? Math.ceil(user.orders.length / ordersPerPage) : 0;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="admin-product-list">
            <div className="product-header">
                <h2>Chi tiết người dùng: {user.username}</h2>
                <button className="add-btn" onClick={() => navigate("/admin/users")}>
                    Quay lại
                </button>
            </div>
            {message && <p className="message error">{message}</p>}
            <div className="user-detail">
                <div className="user-info">
                    <h3>Thông tin cơ bản</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">ID:</span>
                            <span>{user.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Username:</span>
                            <span>{user.username}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">First Name:</span>
                            <span>{user.firstName || "-"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Name:</span>
                            <span>{user.lastName || "-"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Date of Birth:</span>
                            <span>{user.dateOfBirth || "-"}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Image:</span>
                            <span>
                                {user.imageUrl ? (
                                    <img src={user.imageUrl} alt={user.username} className="image-preview" />
                                ) : (
                                    "-"
                                )}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Roles:</span>
                            <span>{user.roles ? user.roles.map(role => role.name).join(", ") : "-"}</span>
                        </div>
                    </div>
                </div>
                <div className="user-address">
                    <h3>Địa chỉ</h3>
                    {user.address ? (
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">House Number:</span>
                                <span>{user.address.houseNumber || "-"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Street:</span>
                                <span>{user.address.street || "-"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ward:</span>
                                <span>{user.address.ward || "-"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">District:</span>
                                <span>{user.address.district || "-"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">City:</span>
                                <span>{user.address.city || "-"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Country:</span>
                                <span>{user.address.country || "-"}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="no-data">Không có thông tin địa chỉ.</p>
                    )}
                </div>
                <div className="user-orders">
                    <h3>Đơn hàng</h3>
                    {user.orders && user.orders.length > 0 ? (
                        <>
                            <div className="product-table">
                                <div className="table-header">
                                    <span>ID</span>
                                    <span>Ngày đặt</span>
                                    <span>Tổng tiền</span>
                                    <span>Trạng thái</span>
                                </div>
                                {currentOrders.map((order) => (
                                    <div key={order.id} className="table-row">
                                        <span>{order.id}</span>
                                        <span>{order.orderDate || "-"}</span>
                                        <span>{order.totalPrice || "-"}</span>
                                        <span>{order.status || "-"}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Phân trang */}
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={currentPage === page ? "active" : ""}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="no-data">Không có đơn hàng nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;