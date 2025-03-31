import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../service/localStorage";
import '../../static/style/login.css'


const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = (event, reason) => {
        if (reason == "clickway") {
            return;
        }

        setOpen(false);
    }

    const handleClick = () => {

    };

    useEffect(() => {
        const accessToken = getToken();

        if (accessToken) {
            navigate("/");
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
            console.log("Response body:", data);
            if (data.code !== 1000) {
              throw new Error(data.message);
            }
            const userData = data.data;
            setToken(userData?.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", userData.nameRole);
            window.dispatchEvent(new Event("authChanged"));
    
            navigate("/");
        })
        .catch((error) => {
            setMessage(error.message);
            setOpen(true);
        });
    };

    return (
        <div className="login-container">
          {open && <div className="snackbar">{message}</div>}
      
          <div className="login-box">
            <h2 className="login-title">Welcome to Trong</h2>
      
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
      
              <button type="submit" className="login-button" onClick={handleSubmit}>Đăng nhập</button>
            </form>
      
            <div className="divider"></div>
      
            {/* <button className="google-login-button" onClick={handleClick}>
              <img src="/google-icon.png" alt="Google" className="google-icon" />
              Continue with Google
            </button> */}
      
            <button className="register-button" onClick={() => navigate("/register")}>
              Tạo tài khoản
            </button>
          </div>
        </div>
      );      
}

export default LoginPage;