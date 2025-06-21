import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Alert, Result } from "antd"
import "../../../static/style/verify.css"

const VerifyAccount = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("info")
  const [email, setEmail] = useState("")
  const [verified, setVerified] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Lấy email từ localStorage
    const storedEmail = localStorage.getItem("verificationEmail")
    if (!storedEmail) {
      // Nếu không có email, chuyển hướng về trang yêu cầu mã xác nhận
      navigate("/request-verification")
      return
    }
    setEmail(storedEmail)
  }, [navigate])

  const handleSubmit = async (values) => {
    setLoading(true)
    setMessage(null)

    try {
      // Gọi API để xác thực tài khoản
      const response = await fetch("http://localhost:8080/api/v1/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          verificationCode: values.verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || "Mã xác nhận không hợp lệ. Vui lòng thử lại.")
        setMessageType("error")
        setLoading(false)
        return
      }

      // Nếu thành công, hiển thị thông báo thành công và chuyển hướng đến trang đăng nhập
      setVerified(true)
      setMessage("Tài khoản đã được xác thực thành công!")
      setMessageType("success")

      // Xóa email từ localStorage
      localStorage.removeItem("verificationEmail")

      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // Gọi API để yêu cầu gửi lại mã xác nhận
      const response = await fetch(`http://localhost:8080/api/v1/auth/resend?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || "Không thể gửi lại mã xác nhận. Vui lòng thử lại.")
        setMessageType("error")
        setLoading(false)
        return
      }

      setMessage("Mã xác nhận mới đã được gửi đến email của bạn.")
      setMessageType("success")
    } catch (error) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="verify-container">
        <div className="verify-box">
          <Result
            status="success"
            title="Xác thực thành công!"
            subTitle="Tài khoản của bạn đã được xác thực. Đang chuyển hướng đến trang đăng nhập..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2 className="verify-title">Xác thực tài khoản</h2>
        <p className="verify-description">
          Mã xác nhận đã được gửi đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến của bạn và nhập mã
          xác nhận dưới đây.
        </p>

        <Form name="verifyAccount" onFinish={handleSubmit} layout="vertical" className="verify-form">
          <Form.Item
            label="Mã xác nhận"
            name="verificationCode"
            rules={[
              { required: true, message: "Vui lòng nhập mã xác nhận!" },
              { len: 6, message: "Mã xác nhận phải có 6 ký tự!" },
            ]}
            required={false}
          >
            <Input placeholder="Nhập mã xác nhận 6 chữ số" maxLength={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="verify-button" loading={loading}>
              Xác nhận
            </Button>
          </Form.Item>

          {message && <Alert message={message} type={messageType} showIcon className="verify-message" />}
        </Form>

        <div className="resend-code">
          Không nhận được mã?{" "}
          <Button type="link" onClick={handleResend} disabled={loading}>
            Gửi lại mã
          </Button>
        </div>

        <p className="login-link">
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault()
              navigate("/login")
            }}
          >
            Quay lại đăng nhập
          </a>
        </p>
      </div>
    </div>
  )
}

export default VerifyAccount
