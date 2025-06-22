import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Typography } from "antd";
import ProductList from "../../../components/user/ProductList";
import Pagination from "../../../components/common/Pagination";
import ApiService from "../../../service/ApiService";
import HomeCategoryFilter from "./HomeCategoryFilter";

const { Text } = Typography;

const HomeProductSection = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [tempSelectedCategories, setTempSelectedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await ApiService.Category.getAllCategories();
        setCategories(categoryResponse.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message || error.message || "Lỗi khi tải danh mục!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let allProducts = [];
      const searchParams = new URLSearchParams(location.search);
      const searchItem = searchParams.get("search");

      if (searchItem) {
        const response = await ApiService.Product.getProductByName(searchItem);
        allProducts = response.data || [];
      } else if (selectedCategories.size > 0) {
        const categoryArray = Array.from(selectedCategories);
        const response = await ApiService.Product.FilterProductByCategories(categoryArray);
        allProducts = response.data || [];
      } else {
        const response = await ApiService.Product.getAllProduct(currentPage, itemsPerPage);
        allProducts = response.data || [];
        const totalCount = response.headers?.["x-total-count"] || allProducts.length;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      }

      setProducts(
        allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      );
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Lỗi khi tải sản phẩm!"
      );
    } finally {
      setLoading(false);
    }
  }, [location.search, selectedCategories, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (checkedValues) => {
    setTempSelectedCategories(new Set(checkedValues));
  };

  const applyFilter = () => {
    setSelectedCategories(new Set(tempSelectedCategories));
    setCurrentPage(1);
  };

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} sm={6} md={5} lg={4}>
        <HomeCategoryFilter
          categories={categories}
          tempSelectedCategories={tempSelectedCategories}
          onToggle={toggleCategory}
          onApply={applyFilter}
          loading={loading}
          error={error}
        />
      </Col>
      <Col xs={24} sm={18} md={19} lg={20}>
        {loading ? (
          <Text>Đang tải sản phẩm...</Text>
        ) : error ? (
          <Text type="danger">{error}</Text>
        ) : products.length === 0 ? (
          <Text>Không tìm thấy sản phẩm nào</Text>
        ) : (
          <div>
            <ProductList products={products} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default HomeProductSection;