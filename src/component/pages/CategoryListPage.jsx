import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../static/style/categoryListPage.css';

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set()); // Danh mục đã chọn nhưng chưa lọc
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            setCategories(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            const newCategories = new Set(prev);
            newCategories.has(categoryId) ? newCategories.delete(categoryId) : newCategories.add(categoryId);
            return newCategories;
        });
    };

    const applyFilter = () => {
        const categoryArray = Array.from(selectedCategories);
        navigate(`/category-products?categories=${categoryArray.join(",")}`);
    };

    return (
        <div className="category-list1">
            {loading ? (
                <p className="loading-message1">Đang tải danh mục...</p>
            ) : error ? (
                <p className="error-message1">{error}</p>
            ) : (
                <div>
                    <h2>Danh mục</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleCategory(category.id)}
                                        checked={selectedCategories.has(category.id)}
                                    />
                                    {category.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={applyFilter} disabled={selectedCategories.size === 0}>
                        Lọc sản phẩm
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryListPage;
