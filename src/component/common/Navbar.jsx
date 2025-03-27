import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../static/style/navbar.css';

// Import icons (using the existing imports)
import homeImage from "../../static/images/home.png";
import categoryImage from "../../static/images/application.png";
import accountImage from "../../static/images/account.png";
import adminImage from "../../static/images/admin.png";
import cartImage from "../../static/images/cart.png";

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(ApiService.isAuthenticated());
    const [totalCartItems, setTotalCartItems] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(false);

    // Toggle account dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            if (ApiService.isAuthenticated()) {
                const userInfo = await ApiService.getMyInfo();
                const userId = userInfo.data.id;
                const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
                const orders = ordersResponse.data || [];
                const pendingOrder = orders.find(order => order.status === "PENDING");

                if (pendingOrder && pendingOrder.orderLines) {
                    const total = pendingOrder.orderLines.reduce((sum, item) => sum + item.quantity, 0);
                    setTotalCartItems(total);
                    
                    // Animate the cart icon when items are added/updated
                    if (total > 0) {
                        setCartUpdated(true);
                        setTimeout(() => setCartUpdated(false), 1000);
                    }
                } else {
                    setTotalCartItems(0);
                }
            } else {
                setTotalCartItems(0);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setTotalCartItems(0);
        }
    };

    // Update login status and cart
    useEffect(() => {
        const updateAuthStatus = () => {
            setIsLoggedIn(ApiService.isAuthenticated());
            fetchCartItems();
        };

        fetchCartItems(); // Initial cart fetch

        // Listen for auth and cart change events
        window.addEventListener("authChanged", updateAuthStatus);
        window.addEventListener("cartChanged", fetchCartItems);

        return () => {
            window.removeEventListener("authChanged", updateAuthStatus);
            window.removeEventListener("cartChanged", fetchCartItems);
        };
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmLogout) {
            ApiService.logout();
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setIsDropdownOpen(false);
            setTotalCartItems(0);
            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            setIsSearching(true);
            navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
            setTimeout(() => setIsSearching(false), 800);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Mobile menu toggle */}
                <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Brand logo */}
                <div className="navbar-brand">
                    <NavLink to="/">
                        <img src="./logo2.png" alt="logo" className="navbar-logo" />
                    </NavLink>
                </div>

                {/* Search form */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button type="submit" className={`search-button ${isSearching ? 'searching' : ''}`}>
                            <span className="search-text">Tìm kiếm</span>
                        </button>
                    </div>
                </form>

                {/* Navigation links */}
                <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={homeImage || "/placeholder.svg"} alt="home" className="navbar-icon" />
                        <span className="nav-text">Trang chủ</span>
                    </NavLink>

                    <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={categoryImage || "/placeholder.svg"} alt="categories" className="navbar-icon" />
                        <span className="nav-text">Danh mục</span>
                    </NavLink>

                    <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`cart-icon-container ${cartUpdated ? 'cart-updated' : ''}`}>
                            <img src={cartImage || "/placeholder.svg"} alt="cart" className="navbar-icon" />
                            {totalCartItems > 0 && (
                                <span className="cart-badge">{totalCartItems}</span>
                            )}
                        </div>
                        <span className="nav-text">Giỏ hàng</span>
                    </NavLink>

                    {isLoggedIn ? (
                        <div className="nav-item" ref={dropdownRef}>
                            <div className="account-button" onClick={toggleDropdown}>
                                <img src={accountImage || "/placeholder.svg"} alt="account" className="navbar-icon" />
                                <span className="nav-text">Tài khoản</span>
                            </div>
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/account"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Thông tin tài khoản
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="dropdown-item"
                                        to="/orders"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Đơn hàng của tôi
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item logout-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsMobileMenuOpen(false)}>
                            <img src={accountImage || "/placeholder.svg"} alt="login" className="navbar-icon" />
                            <span className="nav-text">Đăng nhập</span>
                        </NavLink>
                    )}

                    {ApiService.isAdmin() && (
                        <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsMobileMenuOpen(false)}>
                            <img src={adminImage || "/placeholder.svg"} alt="admin" className="navbar-icon" />
                            <span className="nav-text">Quản trị</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
