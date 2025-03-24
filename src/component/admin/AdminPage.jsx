import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import '../../static/style/adminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [editCategory, setEditCategory] = useState({ id: "", name: "", description: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const itemsPerPage = 5;

    // Product-specific states for Add/Edit modals
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        availableQuantity: '',
        price: '',
        categoryNames: new Set(),
        toppingNames: new Set(),
        image: null
    });
    const [editProduct, setEditProduct] = useState({
        id: '',
        name: '',
        description: '',
        availableQuantity: '',
        price: '',
        categoryNames: new Set(),
        toppingNames: new Set(),
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [allToppings, setAllToppings] = useState([]);

    const menuItems = [
        { id: "dashboard", title: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
        { id: "categories", title: "Categories", icon: "📋", path: "/admin/categories" },
        { id: "products", title: "Products", icon: "🛍️", path: "/admin/products" },
        { id: "orders", title: "Orders", icon: "📦", path: "/admin/orders" },
        { id: "users", title: "Users", icon: "👥", path: "/admin/users" },
        { id: "toppings", title: "Toppings", icon: "🍒", path: "/admin/toppings" },
    ];

    const activeSection = menuItems.find(item => item.path === location.pathname)?.id || "dashboard";

    useEffect(() => {
        if (activeSection === "categories") {
            fetchCategories();
        } else if (activeSection === "products") {
            fetchProducts(currentPage);
            fetchAllCategories();
            fetchAllToppings();
        }
    }, [activeSection, currentPage]);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.log("Error fetching category list", error);
        }
    };

    const fetchProducts = async (page) => {
        try {
            const response = await ApiService.getAllProduct();
            const productList = response.data || [];
            setTotalPages(Math.ceil(productList.length / itemsPerPage));
            setProducts(productList.slice((page - 1) * itemsPerPage, page * itemsPerPage));
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Không thể tải danh sách sản phẩm');
        }
    };

    const fetchCategory = async (id) => {
        try {
            const response = await ApiService.getCategory(id);
            if (response.data) {
                setEditCategory({
                    id: id,
                    name: response.data.name || '',
                    description: response.data.description || ''
                });
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to get category");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            setAllCategories(response.data || []);
        } catch (error) {
            console.error("Error fetching all categories:", error);
        }
    };

    const fetchAllToppings = async () => {
        try {
            const response = await ApiService.getAllToppings();
            setAllToppings(response.data || []);
        } catch (error) {
            console.error("Error fetching all toppings:", error);
        }
    };

    const fetchProduct = async (id) => {
        try {
            const response = await ApiService.getProduct(id);
            const productData = response.data;
            setEditProduct({
                id: id,
                name: productData.name || '',
                description: productData.description || '',
                availableQuantity: productData.availableQuantity || '',
                price: productData.price || '',
                categoryNames: new Set(productData.categories?.map(cat => cat.name) || []),
                toppingNames: new Set(productData.toppings?.map(top => top.name) || []),
                image: null
            });
            setImagePreview(productData.imageUrl || null);
        } catch (error) {
            console.error("Error fetching product:", error);
            setMessage("Failed to load product data");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleEditCategory = (id) => {
        fetchCategory(id);
        setShowEditModal(true);
    };

    const handleEditProduct = (id) => {
        fetchProduct(id);
        setShowEditProductModal(true);
    };

    const handleDeleteCategory = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (confirmed) {
            try {
                await ApiService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                window.confirm("Cannot delete: This category is linked to existing products.");
                console.log("Error deleting category by id", error);
            }
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

    const handleAddCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.addCategory(newCategory);
            if (response.code === 1000) {
                setMessage("Category added successfully!");
                setNewCategory({ name: "", description: "" });
                fetchCategories();
                setTimeout(() => {
                    setShowAddModal(false);
                    setMessage("");
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to save category");
        }
    };

    const handleEditCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.updateCategory(editCategory.id, {
                name: editCategory.name,
                description: editCategory.description
            });
            if (response.data && response.data.id) {
                setMessage("Category updated successfully!");
                fetchCategories();
                setTimeout(() => {
                    setShowEditModal(false);
                    setMessage("");
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update category");
        }
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("description", newProduct.description);
            formData.append("availableQuantity", parseFloat(newProduct.availableQuantity));
            formData.append("price", newProduct.price);
            newProduct.categoryNames.forEach(name => formData.append("categoryNames", name));
            newProduct.toppingNames.forEach(name => formData.append("toppingNames", name));
            if (newProduct.image) formData.append("file", newProduct.image);

            const response = await ApiService.addProduct(formData);
            if (response.status === 200) {
                setMessage("Product added successfully!");
                setNewProduct({
                    name: '',
                    description: '',
                    availableQuantity: '',
                    price: '',
                    categoryNames: new Set(),
                    toppingNames: new Set(),
                    image: null
                });
                setImagePreview(null);
                fetchProducts(currentPage);
                setTimeout(() => {
                    setShowAddProductModal(false);
                    setMessage("");
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to add product");
        }
    };

    const handleEditProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", editProduct.name);
            formData.append("description", editProduct.description);
            formData.append("availableQuantity", parseFloat(editProduct.availableQuantity));
            formData.append("price", editProduct.price);
            editProduct.categoryNames.forEach(name => formData.append("categoryNames", name));
            editProduct.toppingNames.forEach(name => formData.append("toppingNames", name));
            if (editProduct.image) formData.append("file", editProduct.image);

            const response = await ApiService.updateProduct(editProduct.id, formData);
            if (response.status === 200) {
                setMessage("Product updated successfully!");
                fetchProducts(currentPage);
                setTimeout(() => {
                    setShowEditProductModal(false);
                    setMessage("");
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update product");
        }
    };

    const handleProductChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditProduct(prev => ({ ...prev, [name]: value }));
        } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (isEdit) {
            setEditProduct(prev => ({ ...prev, image: file }));
        } else {
            setNewProduct(prev => ({ ...prev, image: file }));
        }
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCategoryChange = (name, isEdit = false) => {
        const trimmedName = name.trim();
        if (isEdit) {
            setEditProduct(prev => {
                const newCategoryNames = new Set(prev.categoryNames);
                if (newCategoryNames.has(trimmedName)) {
                    newCategoryNames.delete(trimmedName);
                } else {
                    newCategoryNames.add(trimmedName);
                }
                return { ...prev, categoryNames: newCategoryNames };
            });
        } else {
            setNewProduct(prev => {
                const newCategoryNames = new Set(prev.categoryNames);
                if (newCategoryNames.has(trimmedName)) {
                    newCategoryNames.delete(trimmedName);
                } else {
                    newCategoryNames.add(trimmedName);
                }
                return { ...prev, categoryNames: newCategoryNames };
            });
        }
    };

    const handleToppingChange = (name, isEdit = false) => {
        const trimmedName = name.trim();
        if (isEdit) {
            setEditProduct(prev => {
                const newToppingNames = new Set(prev.toppingNames);
                if (newToppingNames.has(trimmedName)) {
                    newToppingNames.delete(trimmedName);
                } else {
                    newToppingNames.add(trimmedName);
                }
                return { ...prev, toppingNames: newToppingNames };
            });
        } else {
            setNewProduct(prev => {
                const newToppingNames = new Set(prev.toppingNames);
                if (newToppingNames.has(trimmedName)) {
                    newToppingNames.delete(trimmedName);
                } else {
                    newToppingNames.add(trimmedName);
                }
                return { ...prev, toppingNames: newToppingNames };
            });
        }
    };

    const handleMenuClick = (item) => {
        navigate(item.path);
    };

    const renderContent = () => {
        switch (activeSection) {
            case "categories":
                return (
                    <div className="admin-category-list">
                        <div className="category-header">
                            <h2>Categories Management</h2>
                            <button 
                                className="add-btn"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Category
                            </button>
                        </div>
                        {categories.length === 0 ? (
                            <p className="no-data">No categories found. Add one to get started!</p>
                        ) : (
                            <div className="category-table">
                                <div className="table-header">
                                    <span>Name</span>
                                    <span>Description</span>
                                    <span>Actions</span>
                                </div>
                                {categories.map((category) => (
                                    <div key={category.id} className="table-row">
                                        <span>{category.name}</span>
                                        <span>{category.description || '-'}</span>
                                        <div className="admin-bt">
                                            <button 
                                                className="admin-btn-edit" 
                                                onClick={() => handleEditCategory(category.id)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="admin-btn-delete"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showAddModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Add New Category</h2>
                                    {message && showAddModal && <p className="message">{message}</p>}
                                    <form onSubmit={handleAddCategorySubmit} className="category-form">
                                        <input
                                            type="text"
                                            placeholder="Category Name"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={newCategory.description}
                                            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                        />
                                        <div className="modal-buttons">
                                            <button type="submit">Add Category</button>
                                            <button type="button" onClick={() => setShowAddModal(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showEditModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Edit Category</h2>
                                    {message && showEditModal && <p className="message">{message}</p>}
                                    <form onSubmit={handleEditCategorySubmit} className="category-form">
                                        <input
                                            type="text"
                                            placeholder="Category Name"
                                            value={editCategory.name}
                                            onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={editCategory.description}
                                            onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                                        />
                                        <div className="modal-buttons">
                                            <button type="submit">Update Category</button>
                                            <button type="button" onClick={() => setShowEditModal(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "products":
                return (
                    <div className="admin-product-list">
                        <div className="product-header">
                            <h2>Products Management</h2>
                            <button 
                                className="add-btn"
                                onClick={() => setShowAddProductModal(true)}
                            >
                                Add Product
                            </button>
                        </div>
                        {products.length === 0 ? (
                            <p className="no-data">No products found. Add one to get started!</p>
                        ) : (
                            <div className="product-table">
                                <div className="table-header">
                                    <span>Name</span>
                                    <span>Price</span>
                                    <span>Description</span>
                                    <span>Quantity</span>
                                    <span>Categories</span>
                                    <span>Image</span>
                                    <span>Toppings</span>
                                    <span>Actions</span>
                                </div>
                                {products.map((product) => (
                                    <div key={product.id} className="table-row">
                                        <span>{product.name}</span>
                                        <span>${product.price}</span>
                                        <span>{product.description || '-'}</span>
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
                                                onClick={() => handleEditProduct(product.id)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="admin-btn-delete" 
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Delete
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

                        {showAddProductModal && (
                            <div className="modal-overlay">
                                <div className="modal-content product-modal">
                                    <h2>Add New Product</h2>
                                    {message && showAddProductModal && <p className="message">{message}</p>}
                                    <form onSubmit={handleAddProductSubmit} className="product-form">
                                        <label>Upload Image:</label>
                                        <input type="file" onChange={(e) => handleImageChange(e)} />
                                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Product Name"
                                            value={newProduct.name}
                                            onChange={(e) => handleProductChange(e)}
                                            required
                                        />
                                        <textarea
                                            name="description"
                                            placeholder="Description"
                                            value={newProduct.description}
                                            onChange={(e) => handleProductChange(e)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            placeholder="Available Quantity"
                                            value={newProduct.availableQuantity}
                                            onChange={(e) => handleProductChange(e)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            placeholder="Price"
                                            value={newProduct.price}
                                            onChange={(e) => handleProductChange(e)}
                                            required
                                        />
                                        <label>Categories:</label>
                                        <div className="checkbox-group">
                                            {allCategories.map(cat => (
                                                <label key={cat.id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        value={cat.name}
                                                        onChange={() => handleCategoryChange(cat.name)}
                                                        checked={newProduct.categoryNames.has(cat.name)}
                                                    />
                                                    {cat.name}
                                                </label>
                                            ))}
                                        </div>
                                        <label>Toppings:</label>
                                        <div className="checkbox-group">
                                            {allToppings.map(top => (
                                                <label key={top.id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        value={top.name}
                                                        onChange={() => handleToppingChange(top.name)}
                                                        checked={newProduct.toppingNames.has(top.name)}
                                                    />
                                                    {top.name}
                                                </label>
                                            ))}
                                        </div>
                                        <div className="modal-buttons">
                                            <button type="submit">Add Product</button>
                                            <button type="button" onClick={() => {
                                                setShowAddProductModal(false);
                                                setImagePreview(null);
                                            }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showEditProductModal && (
                            <div className="modal-overlay">
                                <div className="modal-content product-modal">
                                    <h2>Edit Product</h2>
                                    {message && showEditProductModal && <p className="message">{message}</p>}
                                    <form onSubmit={handleEditProductSubmit} className="product-form">
                                        <label>Upload Image:</label>
                                        <input type="file" onChange={(e) => handleImageChange(e, true)} />
                                        {imagePreview && <img src={imagePreview} alt={editProduct.name} className="image-preview" />}
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Product Name"
                                            value={editProduct.name}
                                            onChange={(e) => handleProductChange(e, true)}
                                            required
                                        />
                                        <textarea
                                            name="description"
                                            placeholder="Description"
                                            value={editProduct.description}
                                            onChange={(e) => handleProductChange(e, true)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="availableQuantity"
                                            placeholder="Available Quantity"
                                            value={editProduct.availableQuantity}
                                            onChange={(e) => handleProductChange(e, true)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            placeholder="Price"
                                            value={editProduct.price}
                                            onChange={(e) => handleProductChange(e, true)}
                                            required
                                        />
                                        <label>Categories:</label>
                                        <div className="checkbox-group">
                                            {allCategories.map(cat => (
                                                <label key={cat.id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        value={cat.name}
                                                        onChange={() => handleCategoryChange(cat.name, true)}
                                                        checked={editProduct.categoryNames.has(cat.name)}
                                                    />
                                                    {cat.name}
                                                </label>
                                            ))}
                                        </div>
                                        <label>Toppings:</label>
                                        <div className="checkbox-group">
                                            {allToppings.map(top => (
                                                <label key={top.id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        value={top.name}
                                                        onChange={() => handleToppingChange(top.name, true)}
                                                        checked={editProduct.toppingNames.has(top.name)}
                                                    />
                                                    {top.name}
                                                </label>
                                            ))}
                                        </div>
                                        <div className="modal-buttons">
                                            <button type="submit">Update Product</button>
                                            <button type="button" onClick={() => {
                                                setShowEditProductModal(false);
                                                setImagePreview(null);
                                            }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "dashboard":
                return <p>Welcome to the Admin Dashboard</p>;
            default:
                return <p>Select a section from the sidebar or implement this section!</p>;
        }
    };

    return (
        <div className="admin-layout">
            <div className="sidebar">
                <h2>Admin Panel</h2>
                <div className="menu-items">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-title">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;