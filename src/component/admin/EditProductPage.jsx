import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/addProduct.css";

const EditProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        availableQuantity: '',
        price: '',
        categoryNames: new Set(),
        toppingNames: new Set(),
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getAllCategories()
            .then(res => {
                const categoryData = res.data.data || res.data || [];
                console.log("Categories fetched:", categoryData);
                setCategories(categoryData);
            })
            .catch(err => console.error("Error fetching categories:", err));

        ApiService.getAllToppings()
            .then(res => {
                const toppingData = res.data.data || res.data || [];
                console.log("Toppings fetched:", toppingData);
                setToppings(toppingData);
            })
            .catch(err => console.error("Error fetching toppings:", err));

        if (productId) {
            ApiService.getProduct(productId)
                .then(response => {
                    const productData = response.data;
                    console.log("Product fetched:", productData);
                    setProduct({
                        name: productData.name || '',
                        description: productData.description || '',
                        availableQuantity: productData.availableQuantity || '',
                        price: productData.price || '',
                        categoryNames: new Set(productData.categories?.map(cat => cat.name) || []),
                        toppingNames: new Set(productData.toppings?.map(top => top.name) || []),
                        image: null,
                    });
                    setImagePreview(productData.imageUrl || null);
                })
                .catch(err => console.error("Error fetching product:", err));
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProduct(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCategoryChange = (name) => {
        const trimmedName = name.trim();
        setProduct(prev => {
            const newCategoryNames = new Set(prev.categoryNames);
            if (newCategoryNames.has(trimmedName)) {
                newCategoryNames.delete(trimmedName);
            } else {
                newCategoryNames.add(trimmedName);
            }
            return { ...prev, categoryNames: newCategoryNames };
        });
    };

    const handleToppingChange = (name) => {
        const trimmedName = name.trim();
        setProduct(prev => {
            const newToppingNames = new Set(prev.toppingNames);
            if (newToppingNames.has(trimmedName)) {
                newToppingNames.delete(trimmedName);
            } else {
                newToppingNames.add(trimmedName);
            }
            return { ...prev, toppingNames: newToppingNames };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("description", product.description);
            formData.append("availableQuantity", parseFloat(product.availableQuantity));
            formData.append("price", product.price);
            product.categoryNames.forEach(name => formData.append("categoryNames", name));
            product.toppingNames.forEach(name => formData.append("toppingNames", name));
            if (product.image) formData.append("file", product.image);

            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await ApiService.updateProduct(productId, formData);
            if (response.status === 200) {
                setMessage("Đã cập nhật sản phẩm thành công");
                setTimeout(() => {
                    setMessage("");
                    navigate("/admin/products");
                }, 2000);
            }
        } catch (error) {
            console.error("Error updating product:", error.response?.data);
            setMessage(error.response?.data?.message || "Không thể cập nhật sản phẩm");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Edit Product</h2>
                {message && <div className="message">{message}</div>}

                <label>Upload Image:</label>
                <input type="file" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt={product.name} className="image-preview" />}

                <input
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="availableQuantity"
                    placeholder="Available Quantity"
                    value={product.availableQuantity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />

                <label>Categories:</label>
                <div className="checkbox-group">
                    {categories.map(cat => (
                        <label key={cat.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={cat.name}
                                onChange={() => handleCategoryChange(cat.name)}
                                checked={product.categoryNames.has(cat.name)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <label>Toppings:</label>
                <div className="checkbox-group">
                    {toppings.map(top => (
                        <label key={top.id} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={top.name}
                                onChange={() => handleToppingChange(top.name)}
                                checked={product.toppingNames.has(top.name)}
                            />
                            {top.name}
                        </label>
                    ))}
                </div>

                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProductPage;