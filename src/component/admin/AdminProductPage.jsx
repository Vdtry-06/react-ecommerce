import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import "../../static/style/adminProductPage.css";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const fetchProducts = async (page) => {
        try {
            const response = await ApiService.getAllProduct();
            const productList = response.data || [];
            setTotalPages(Math.ceil(productList.length / itemsPerPage));
            setProducts(productList.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Không thể tải danh sách sản phẩm');
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handleEdit = (id) => {
        navigate(`/admin/edit-product/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
        if (confirmed) {
            try {
                const response = await ApiService.deleteProduct(id);
                if (response.status === 200) {
                    fetchProducts(currentPage);
                    setError(null);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    setError(error.response?.data?.message || "Không thể xóa sản phẩm");
                }
            }
        }
    };

    return (
        <div className="admin-product-list">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <h2>Products</h2>
                    <button className="product-btn" onClick={() => navigate('/admin/add-product')}>
                        Add Product
                    </button>
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <span>{product.price}</span>
                                <span>{product.description}</span>
                                <span>{product.availableQuantity}</span>
                                <span>
                                    {product.categories.map((category) => category.name).join(", ")}
                                </span>
                                <span>
                                    {product.categories.map((category) => category.description).join(", ")}
                                </span>
                                <img src={product.imageUrl} alt={product.name} width="100" />
                                <span>
                                    {product.toppings.length > 0
                                        ? product.toppings.map((topping) => topping.name).join(", ")
                                        : "Không có toppings"}
                                </span>
                                <span>
                                    {product.toppings.length > 0
                                        ? product.toppings.map((topping) => `$${topping.price}`).join(", ")
                                        : "-"}
                                </span>
                                <button className="product-btn" onClick={() => handleEdit(product.id)}>
                                    Edit
                                </button>
                                <button className="product-btn-delete" onClick={() => handleDelete(product.id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminProductPage;