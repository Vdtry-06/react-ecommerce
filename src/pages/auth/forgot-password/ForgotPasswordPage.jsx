import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import "../../../static/style/forgot-password.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      setMessageVisible(true);
      const timer = setTimeout(() => setMessageVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (successMessage) {
      setSuccessMessageVisible(true);
      const timer = setTimeout(() => setSuccessMessageVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSendEmail = async (values) => {
    setMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );
      const data = await response.json();
      if (data.data) {
        setSuccessMessage(
          "Mã xác nhận đã được gửi tới email của bạn. Vui lòng kiểm tra email để nhập mã code."
        );
        setShowVerification(true);
      } else {
        setMessage("Email không tồn tại hoặc có lỗi xảy ra.");
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra khi gửi email.");
      console.error(err);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Quên mật khẩu</h2>
        {!showVerification ? (
          <Form
            name="forgot-password"
            onFinish={handleSendEmail}
            layout="vertical"
            className="email-section"
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
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="send-button">
                Gửi mã xác nhận
              </Button>
            </Form.Item>
            {successMessage && successMessageVisible && (
              <Alert
                message={successMessage}
                type="success"
                className="success-message"
                showIcon
              />
            )}
            {message && messageVisible && (
              <Alert
                message={message}
                type="error"
                className="error-message"
                showIcon
              />
            )}
          </Form>
        ) : (
          <VerifyResetPassword email={email} navigate={navigate} />
        )}
      </div>
    </div>
  );
};

const VerifyResetPassword = ({ email, navigate }) => {
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setMessageVisible(true);
      const timer = setTimeout(() => setMessageVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleVerifyAndReset = async (values) => {
    setMessage("");
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/verify-email-reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            verificationCode: values.verificationCode,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        }
      );
      const data = await response.json();
      if (data.data) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        setMessage(
          "Mã xác nhận không đúng, mật khẩu không khớp hoặc có lỗi xảy ra."
        );
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra khi đặt lại mật khẩu.");
      console.error(err);
    }
  };

  return (
    <Form
      name="verify-reset"
      onFinish={handleVerifyAndReset}
      layout="vertical"
      className="verification-section"
    >
      <Form.Item
        label="Mã xác nhận"
        name="verificationCode"
        rules={[{ required: true, message: "Vui lòng nhập mã xác nhận!" }]}
        required={false}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        required={false}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        required={false}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="reset-button">
          Đặt lại mật khẩu
        </Button>
      </Form.Item>
      {message && messageVisible && (
        <Alert
          message={message}
          type="error"
          className="error-message"
          showIcon
        />
      )}
    </Form>
  );
};

export default ForgotPasswordPage;
