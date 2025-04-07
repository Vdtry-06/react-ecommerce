import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import "../../static/style/home.css";

const CategoryProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("categoryId");
    console.log("Location search:", location.search);
    console.log("Selected category ID:", categoryId);
    setSelectedCategoryId(categoryId ? Number(categoryId) : null);
    setCurrentPage(1);
  }, [location]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts();
    } else {
      setProducts([]);
      setTotalPages(0);
    }
  }, [selectedCategoryId, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.FilterProductByCategory(
        selectedCategoryId,
        currentPage - 1,
        itemsPerPage
      );
      console.log("Fetch products response:", response);

      // Lấy dữ liệu từ response.data.data.content
      const fetchedProducts = response.data?.data?.content || [];
      const fetchedTotalPages = response.data?.data?.totalPages || 0;

      setProducts(fetchedProducts);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Lỗi khi tải sản phẩm!");
      setProducts([]);
      setTotalPages(0);
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