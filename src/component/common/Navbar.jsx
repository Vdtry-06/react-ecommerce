import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (confirm) {
            ApiService.logout();
            setTimeout(() => {
                navigate("/login");
            }, 500);
        }
        ApiService.logout();
        navigate("/");
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/">
                    <img src="./logo1.png" alt="logo" className="navbar-logo"></img>
                </NavLink>
            </div>
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
            <div className="navbar-link">
                <NavLink to="/" activeClassName="active">Home</NavLink>
                <NavLink to="/products" activeClassName="active">Products</NavLink>
                {isAuthenticated && <NavLink to="/profile" activeClassName="active">My Account</NavLink>}
                {isAdmin && <NavLink to="/admin" activeClassName="active">Admin</NavLink>}
                {isAuthenticated && <NavLink to="/logout" onClick={handleLogout}>Logout</NavLink>}
                {!isAuthenticated && <NavLink to="/login" activeClassName="active">Login</NavLink>}
                <NavLink to="/cart" activeClassName="active">Cart</NavLink>
            </div>
        </nav>
    );
}

export default Navbar;