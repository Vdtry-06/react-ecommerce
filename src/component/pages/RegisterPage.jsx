import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Alert } from "antd"
import "../../static/style/register.css"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  })
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("error")
  const [messageVisible, setMessageVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add("register-body")
    return () => {
      document.body.classList.remove("register-body")
    }
  }, [])

  useEffect(() => {
    if (message) {
      setMessageVisible(true)
      if (messageType === "success") {
        const timer = setTimeout(() => setMessageVisible(false), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [message, messageType])

  const handleSubmit = async (values) => {
    setMessage(null)
    setMessageVisible(false)

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data && data.message) {
          setMessage(data.message)
          setMessageType("error")
        } else {
          setMessage("Đăng ký thất bại. Vui lòng thử lại.")
          setMessageType("error")
        }
        return
      }

      if (data.code !== 1000 && data.code !== undefined) {
        setMessage(data.message || "Đăng ký thất bại")
        setMessageType("error")
        return
      }

      setMessage("Đăng ký thành công! Vui lòng xác thực tài khoản của bạn.")
      setMessageType("success")
      localStorage.setItem("verificationEmail", values.email)
      setTimeout(() => {
        navigate("/verify-account")
      }, 3000)
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.")
      setMessageType("error")
    }
  }

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (messageVisible && messageType === "error") {
      setMessageVisible(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Đăng ký</h2>
        <Form name="register" onFinish={handleSubmit} layout="vertical" className="register-form">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            required={false}
          >
            <Input placeholder="Email" value={formData.email} onChange={(e) => handleInputChange(e, "email")} />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
            required={false}
          >
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange(e, "username")}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            ]}
            required={false}
          >
            <Input.Password
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Gửi
            </Button>
          </Form.Item>
          {message && messageVisible && (
            <Alert
              message={message}
              type={messageType}
              className="message"
              showIcon
              closable
              onClose={() => setMessageVisible(false)}
            />
          )}
        </Form>
        <p className="login-link">
          Bạn đã có tài khoản?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault()
              navigate("/login")
            }}
          >
            Đăng nhập
          </a>
        </p>
        <p className="login-link">
          Bạn đã xác thực tài khoản?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault()
              navigate("/request-verification")
            }}
          >
            Xác thực
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
