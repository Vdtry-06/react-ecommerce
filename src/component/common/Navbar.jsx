import React, {useState, useEffect, useRef} from "react";
import '../../static/style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import homeImage from "../../static/images/home.png"
import categoryImage from "../../static/images/application.png"
import accountImage from "../../static/images/account.png"
import adminImage from "../../static/images/admin.png"
import cartImage from "../../static/images/cart.png"

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
        console.log("Dropdown toggled:", !isDropdownOpen);
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
    const isAuthenticated = ApiService.isAuthenticated();

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    const [isLoggedIn, setIsLoggedIn] = useState(ApiService.isAuthenticated()); 

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            ApiService.logout();
            localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
            setIsLoggedIn(false);
            setIsDropdownOpen(false);
            window.dispatchEvent(new Event("authChanged")); // Gửi sự kiện thông báo đăng xuất
            navigate("/login");
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-brand">
                    <NavLink to="/">
                        <img src="./logo2.png" alt="logo" className="navbar-logo" />
                    </NavLink>
                </div>
    
                {/* Ô tìm kiếm */}
                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <button type="submit" className="search-button">
                        <i className="fas fa-search">Search</i>
                    </button>
                </form>
    
                {/* Menu */}
                <div className="navbar-link">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                        <img src={homeImage} alt="home" className="navbar-home" />
                    </NavLink>

                    <NavLink to="/categories" className={({ isActive }) => isActive ? "active" : ""}>
                        <img src={categoryImage} alt="categories" className="navbar-home" />
                    </NavLink>

                    <NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>
                        <img src={cartImage} alt="cart" className="navbar-home" />
                    </NavLink>

                    {/* Account Dropdown */}
                    {isLoggedIn ? (
                        <div className="nav-item" ref={dropdownRef}>
                            <img 
                                src={accountImage} 
                                alt="account" 
                                className="navbar-home" 
                                onClick={toggleDropdown} 
                                style={{ cursor: "pointer" }}
                            />
                            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <li>
                                    <NavLink className="dropdown-item" to="/account">Account</NavLink>
                                </li>
                                <li>
                                    <NavLink className="dropdown-item" to="/logout" onClick={handleLogout}>Logout</NavLink>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                            Login
                        </NavLink>
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
}

export default Navbar;
