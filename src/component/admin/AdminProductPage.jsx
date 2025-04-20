import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal, message } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/adminProduct.css";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Product.getAllProduct();
      setProducts(response.data || []);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải danh sách sản phẩm");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa sản phẩm này không?",
      content: "Hành động này không thể hoàn tác.",
      onOk: async () => {
        setLoading(true);
        try {
          await ApiService.Product.deleteProduct(productId);
          setProducts(products.filter((p) => p.id !== productId));
          message.success("Xóa sản phẩm thành công");
        } catch (error) {
          if (error.response?.status === 401) {
            message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          } else {
            message.error(
              error.response?.data?.message || "Không thể xóa sản phẩm vì đã có ràng buộc."
            );
          }
          console.error("Error deleting product:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Table columns
  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories && categories.length > 0 ? (
          <select className="dropdown-cell">
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        ) : (
          "-"
        ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <img src={url || "/placeholder.svg?height=60&width=60"} alt="product" width="60" />
      ),
    },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      render: (toppings) =>
        toppings && toppings.length > 0 ? (
          <select className="dropdown-cell">
            {toppings.map((topping) => (
              <option key={topping.id} value={topping.name}>
                {topping.name}
              </option>
            ))}
          </select>
        ) : (
          "-"
        ),
    },
    {
      title: "Chỉnh sửa",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/admin/edit-product/${record.id}`)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="admin-product-list">
      <div className="product-header">
        <h2>Quản lý sản phẩm</h2>
        <Button type="primary" onClick={() => navigate("/admin/add-product")}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Chưa có sản phẩm nào. Thêm một sản phẩm để bắt đầu!" }}
      />
    </div>
  );
};

export default AdminProductPage;