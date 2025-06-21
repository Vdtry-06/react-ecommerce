import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../../../service/ApiService";
import ProductList from "../../common/ProductList";
import Pagination from "../../common/Pagination";
import '../../../static/style/home.css';

const CategoryProductsPage = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categories = params.get("categories")?.split(",") || [];
        setSelectedCategories(new Set(categories));
    }, [location]);

    useEffect(() => {
        if (selectedCategories.size > 0) {
            fetchProducts();
        }
    }, [selectedCategories, currentPage]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const categoryArray = Array.from(selectedCategories);
            const response = await ApiService.Product.FilterProductByCategories(categoryArray);
            setProducts(response.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Lỗi khi tải sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            {loading ? (
                <p className="loading-message">Đang tải sản phẩm...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    {products.length === 0 ? (
                        <p className="no-products">Không tìm thấy sản phẩm nào</p>
                    ) : (
                        <>
                            <ProductList products={products} />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;
