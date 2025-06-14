import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Form, Input, Button, message, Typography } from "antd"
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography
const { TextArea } = Input

const AddCategory = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await ApiService.Category.addCategory(values)
      if (response.code === 1000) {
        message.success("Danh mục đã được thêm thành công!")
        form.resetFields()
        setTimeout(() => {
          navigate("/admin/categories")
        }, 1000)
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể thêm danh mục")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          gap: "16px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/categories")}
          style={{
            borderRadius: "8px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Quay lại
        </Button>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Thêm danh mục mới
        </Title>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: "600px" }}>
          <Form.Item
            name="name"
            label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Tên danh mục</span>}
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input
              placeholder="Nhập tên danh mục..."
              style={{
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Mô tả</span>}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả danh mục..."
              style={{
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
                style={{
                  height: "48px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  minWidth: "140px",
                }}
              >
                Thêm danh mục
              </Button>
              <Button
                onClick={() => navigate("/admin/categories")}
                style={{
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  minWidth: "100px",
                }}
              >
                Hủy bỏ
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AddCategory
