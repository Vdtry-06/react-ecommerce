import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/register.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("register-body");
        return () => {
            document.body.classList.remove("register-body");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.registerUser(formData);
            if (response.status === 200) {
                setMessage("User Successfully Registered");
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
            setMessage(response.message);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "An error occurred");
        }
    };

    return (
        <div className="register-page">
            <h2>Đăng ký</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Gửi</button>
                <p className="register-link">
                    Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
