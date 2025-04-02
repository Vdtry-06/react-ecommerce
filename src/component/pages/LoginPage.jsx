import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../service/localStorage";
import '../../static/style/login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const accessToken = getToken();
        if (accessToken) {
            navigate("/");
        }

        // Handle OAuth2 redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("oauth2") === "true") {
            fetch("http://localhost:8080/api/v1/auth/oauth2/success", {
                method: "GET",
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.data && data.data.token) {
                        setToken(data.data.token);
                        localStorage.setItem("isLoggedIn", "true");
                        localStorage.setItem("role", data.data.nameRole);
                        window.dispatchEvent(new Event("authChanged"));
                        navigate("/");
                    } else {
                        throw new Error("OAuth2 login failed");
                    }
                })
                .catch((error) => {
                    setMessage(error.message);
                    setOpen(true);
                });
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.data || !data.data.token) {
                    throw new Error(data.message || "Login failed");
                }
                setToken(data.data.token);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", data.data.nameRole);
                window.dispatchEvent(new Event("authChanged"));
                navigate("/");
            })
            .catch((error) => {
                setMessage(error.message);
                setOpen(true);
            });
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:8080/api/v1/oauth2/authorization/${provider}`;
    };

    return (
        <div className="login-container">
            {open && <div className="snackbar">{message}</div>}

            <div className="login-box">
                <h2 className="login-title">Đăng nhập</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="forgot-password">
                        <a href="/forgot-password" onClick={(e) => {
                            e.preventDefault();
                            navigate("/forgot-password");
                        }}>Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className="login-button">Gửi</button>
                </form>

                <div className="divider"></div>

                <button
                    className="google-login-button"
                    onClick={() => handleOAuthLogin("google")}
                >
                    <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png" alt="Google" className="google-icon" />
                    Continue with Google
                </button>

                <button
                    className="github-login-button"
                    onClick={() => handleOAuthLogin("github")}
                >
                    <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub" className="github-icon" />
                    Continue with GitHub
                </button>

                <button className="register-button" onClick={() => navigate("/register")}>
                    Tạo tài khoản
                </button>
            </div>
        </div>
    );
};

export default LoginPage;