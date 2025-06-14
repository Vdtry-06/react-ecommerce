import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Table, Modal, message, Card, Typography, Space, Tag } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined } from "@ant-design/icons"
import ApiService from "../../service/ApiService"

const { Title } = Typography

const AdminProductPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await ApiService.Product.getAllProduct()
      setProducts(response.data || [])
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải danh sách sản phẩm")
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: "Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        setLoading(true)
        try {
          await ApiService.Product.deleteProduct(productId)
          setProducts(products.filter((p) => p.id !== productId))
          message.success("Xóa sản phẩm thành công")
        } catch (error) {
          if (error.response?.status === 401) {
            message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
          } else {
            message.error(error.response?.data?.message || "Không thể xóa sản phẩm vì đã có ràng buộc.")
          }
          console.error("Error deleting product:", error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          #{id}
        </span>
      ),
      fixed: "left",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name) => <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{name}</span>,
      fixed: "left",
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrls",
      key: "imageUrls",
      render: (imageUrls) => (
        <img
          src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : ""}
          alt="product"
          style={{
            width: 60,
            height: 60,
            objectFit: "cover",
            borderRadius: "8px",
            border: "2px solid #e2e8f0",
          }}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {price.toFixed(0)} VNĐ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      render: (quantity) => (
        <Tag
          color={quantity > 10 ? "#10b981" : quantity > 0 ? "#f59e0b" : "#ef4444"}
          style={{
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          {quantity}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories && categories.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {categories.map((category) => (
              <Tag
                key={category.id}
                style={{
                  background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                  color: "#7c3aed",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                {category.name}
              </Tag>
            ))}
          </div>
        ) : (
          <span style={{ color: "#64748b" }}>Chưa phân loại</span>
        ),
    },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      render: (toppings) =>
        toppings && toppings.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {toppings.map((toppings) => (
              <Tag
                key={toppings.id}
                style={{
                  background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                  color: "#7c3aed",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                {toppings.name}
              </Tag>
            ))}
          </div>
        ) : (
          <span style={{ color: "#64748b" }}>Chưa phân loại</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/edit-product/${record.id}`)}
            style={{
              color: "#3b82f6",
              borderRadius: "6px",
            }}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{
              borderRadius: "6px",
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginTop: -20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingOutlined style={{ color: "white", fontSize: "20px" }} />
          </div>
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
            Quản lý sản phẩm
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/add-product")}
          style={{
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
          locale={{ emptyText: "Chưa có sản phẩm nào. Thêm một sản phẩm để bắt đầu!" }}
          style={{ borderRadius: "16px"}}
        />
      </Card>
    </div>
  )
}

export default AdminProductPage
