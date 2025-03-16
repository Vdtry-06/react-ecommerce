import React, { useState, useEffect, useRef } from "react";
import '../../static/style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";  // Import useCart
import homeImage from "../../static/images/home.png";
import categoryImage from "../../static/images/application.png";
import accountImage from "../../static/images/account.png";
import adminImage from "../../static/images/admin.png";
import cartImage from "../../static/images/cart.png";

const Navbar = () => {
    const { cart } = useCart(); // Lấy giỏ hàng từ context
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const updateAuthStatus = () => {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        };

        window.addEventListener("authChanged", updateAuthStatus);
        return () => {
            window.removeEventListener("authChanged", updateAuthStatus);
        };
    }, []);

    const isAdmin = ApiService.isAdmin();
    const [isLoggedIn, setIsLoggedIn] = useState(ApiService.isAuthenticated());

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            ApiService.logout();
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setIsDropdownOpen(false);
            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
        }
    };

    // 🛒 Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <NavLink to="/">
                        <img src="./logo2.png" alt="logo" className="navbar-logo" />
                    </NavLink>
                </div>

                <form className="navbar-search" onSubmit={(e) => { e.preventDefault(); navigate(`/?search=${searchValue}`); }}>
                    <input type="text" className="search-input" placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    <button type="submit" className="search-button">Search</button>
                </form>

                <div className="navbar-link">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                        <img src={homeImage} alt="home" className="navbar-home" />
                    </NavLink>

                    <NavLink to="/categories" className={({ isActive }) => isActive ? "active" : ""}>
                        <img src={categoryImage} alt="categories" className="navbar-home" />
                    </NavLink>

                    {/* 🛒 Hiển thị số lượng sản phẩm trên icon giỏ hàng */}
                    <NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""} style={{ position: "relative" }}>
                        <img src={cartImage} alt="cart" className="navbar-home" />
                        {totalCartItems > 0 && (
                            <span className="cart-badge">{totalCartItems}</span> // Badge hiển thị số lượng
                        )}
                    </NavLink>

                    {isLoggedIn ? (
                        <div className="nav-item" ref={dropdownRef}>
                            <img src={accountImage} alt="account" className="navbar-home" onClick={toggleDropdown} style={{ cursor: "pointer" }} />
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <li><NavLink className="dropdown-item" to="/account">Account</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/logout" onClick={handleLogout}>Logout</NavLink></li>
                            </ul>
                        </div>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
                    )}

                    {isAdmin && (
                        <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
                            <img src={adminImage} alt="admin" className="navbar-home" />
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
