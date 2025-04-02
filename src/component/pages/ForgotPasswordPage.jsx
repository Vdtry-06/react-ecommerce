import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/style/forgot-password.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showVerification, setShowVerification] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleSendEmail = () => {
        fetch("http://localhost:8080/api/v1/auth/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) { // Kiểm tra xem có data trả về không (tức là email tồn tại)
                    setSuccessMessage("Mã xác nhận đã được gửi tới email của bạn. Vui lòng kiểm tra email để nhập mã code.");
                    setShowVerification(true);
                    setMessage(""); // Xóa thông báo lỗi nếu có
                } else {
                    setMessage("Email không tồn tại hoặc có lỗi xảy ra.");
                }
            })
            .catch((err) => {
                setMessage("Có lỗi xảy ra khi gửi email.");
                console.error(err);
            });
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Quên mật khẩu</h2>
                {!showVerification ? (
                    <div className="email-section">
                        <div className="input-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button onClick={handleSendEmail} className="send-button">
                            Gửi mã xác nhận
                        </button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                ) : (
                    <VerifyResetPassword email={email} navigate={navigate} />
                )}
                {message && <p className="error-message">{message}</p>}
            </div>
        </div>
    );
};

const VerifyResetPassword = ({ email, navigate }) => {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleVerifyAndReset = () => {
        fetch("http://localhost:8080/api/v1/auth/verify-email-reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, verificationCode, newPassword, confirmPassword }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) { // Reset thành công
                    localStorage.setItem("isLoggedIn", "true");
                    navigate("/");
                } else {
                    setMessage("Mã xác nhận không đúng, mật khẩu không khớp hoặc có lỗi xảy ra.");
                }
            })
            .catch((err) => {
                setMessage("Có lỗi xảy ra khi đặt lại mật khẩu.");
                console.error(err);
            });
    };

    return (
        <div className="verification-section">
            <div className="input-group">
                <label>Mã xác nhận:</label>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label>Mật khẩu mới:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label>Xác nhận mật khẩu:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button onClick={handleVerifyAndReset} className="reset-button">
                Đặt lại mật khẩu
            </button>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
};

export default ForgotPasswordPage;