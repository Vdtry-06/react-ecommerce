import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, setRole, setIsLoggedIn, getRole } from "../../service/localStorage";
import { Form, Input, Button, Alert } from "antd";
import "../../static/style/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    const accessToken = getToken();
    const role = getRole();
    if (accessToken) {
      if (role?.toUpperCase() === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/beverage");
      }
    }

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
            setIsLoggedIn("true");
            setRole(data.data.nameRole);
            window.dispatchEvent(new Event("authChanged"));
            if (data.data.nameRole?.toUpperCase() === "ADMIN") {
              navigate("/admin/dashboard");
            } else {
              navigate("/beverage");
            }
          } else {
            throw new Error("OAuth2 login failed");
          }
        })
        .catch((error) => {
          setError(error.message);
          setErrorVisible(true);
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (values) => {
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      }

      if (data.code !== 1000) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      if (!data.data || !data.data.token) {
        throw new Error("Đăng nhập thất bại, vui lòng thử lại");
      }

      setToken(data.data.token);
      setIsLoggedIn("true");
      setRole(data.data.nameRole);
      window.dispatchEvent(new Event("authChanged"));
      if (data.data.nameRole?.toUpperCase() === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/beverage");
      }
    } catch (error) {
      setError(error.message || "Đã xảy ra lỗi khi đăng nhập");
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/api/v1/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>
        <Form
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            required={false}
          >
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            required={false}
          >
            <Input.Password
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </Form.Item>
          <div className="forgot-password">
            <a
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Quên mật khẩu?
            </a>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
            >
              Gửi
            </Button>
          </Form.Item>
          {error && errorVisible && (
            <Alert
              message={error}
              type="error"
              className="error-message"
              showIcon
            />
          )}
        </Form>
        <div className="divider" />
        <Button
          className="google-login-button"
          onClick={() => handleOAuthLogin("google")}
        >
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </Button>
        <Button
          className="github-login-button"
          onClick={() => handleOAuthLogin("github")}
        >
          <img
            src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
            alt="GitHub"
            className="github-icon"
          />
          Continue with GitHub
        </Button>
        <Button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Tạo tài khoản
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;