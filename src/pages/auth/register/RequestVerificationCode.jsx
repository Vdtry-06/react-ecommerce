import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import "../../../static/style/verify.css";

const RequestVerificationCode = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/resend?email=${values.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Không thể gửi mã xác nhận. Vui lòng thử lại."
        );
        setMessageType("error");
        setLoading(false);
        return;
      }

      setMessage(
        "Mã xác nhận đã được gửi đến email của bạn. Đang chuyển hướng..."
      );
      setMessageType("success");

      localStorage.setItem("verificationEmail", values.email);

      setTimeout(() => {
        navigate("/verify-account");
      }, 2000);
    } catch (error) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2 className="verify-title">Xác thực tài khoản</h2>
        <p className="verify-description">
          Nhập email của bạn để nhận mã xác nhận. Mã xác nhận sẽ được gửi đến
          email của bạn.
        </p>

        <Form
          name="requestVerification"
          onFinish={handleSubmit}
          layout="vertical"
          className="verify-form"
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
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="verify-button"
              loading={loading}
            >
              Gửi mã xác nhận
            </Button>
          </Form.Item>

          {message && (
            <Alert
              message={message}
              type={messageType}
              showIcon
              className="verify-message"
            />
          )}
        </Form>

        <p className="login-link">
          Đã có tài khoản đã xác thực?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default RequestVerificationCode;
