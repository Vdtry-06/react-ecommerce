import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await ApiService.getAllProduct();
      const productList = response.data || [];
      setTotalPages(Math.ceil(productList.length / itemsPerPage));
      setProducts(productList.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Không thể tải danh sách sản phẩm");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (confirmed) {
      try {
        const response = await ApiService.deleteProduct(id);
        if (response.status === 200) {
          window.confirm("Xóa sản phẩm thành công");
          fetchProducts(currentPage);
          setError(null);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(error.response?.data?.message || "Không thể xóa sản phẩm vì đã có ràng buộc.");
        }
      }
    }
  };

  return (
    <div className="admin-product-list">
      <div className="product-header">
        <h2>Quản lý sản phẩm</h2>
        <button className="add-btn" onClick={() => navigate("/admin/add-product")}>
          Thêm sản phẩm
        </button>
      </div>
      {products.length === 0 ? (
        <p className="no-data">Chưa có sản phẩm nào. Thêm một sản phẩm để bắt đầu!</p>
      ) : (
        <div className="product-table">
          <div className="table-header">
            <span>Tên</span>
            <span>Giá</span>
            <span>Mô tả</span>
            <span>Số lượng</span>
            <span>Danh mục</span>
            <span>Ảnh</span>
            <span>Toppings</span>
            <span>Chỉnh sửa</span>
          </div>
          {products.map((product) => (
            <div key={product.id} className="table-row">
              <span>{product.name}</span>
              <span>${product.price}</span>
              <span>{product.description || "-"}</span>
              <span>{product.availableQuantity}</span>
              <span>
                <select className="dropdown-cell">
                  {product.categories.length > 0 ? (
                    product.categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="-">-</option>
                  )}
                </select>
              </span>
              <span>
                <img src={product.imageUrl} alt={product.name} width="60" />
              </span>
              <span>
                <select className="dropdown-cell">
                  {product.toppings.length > 0 ? (
                    product.toppings.map((topping) => (
                      <option key={topping.id} value={topping.name}>
                        {topping.name}
                      </option>
                    ))
                  ) : (
                    <option value="-">-</option>
                  )}
                </select>
              </span>
              <div className="admin-bt">
                <button
                  className="admin-btn-edit"
                  onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="admin-btn-delete"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AdminProductPage;