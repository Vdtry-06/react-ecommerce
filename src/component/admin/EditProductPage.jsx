import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    description: "",
    availableQuantity: "",
    price: "",
    categoryNames: new Set(),
    toppingNames: new Set(),
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct(productId);
    fetchAllCategories();
    fetchAllToppings();
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      const response = await ApiService.getProduct(id);
      const productData = response.data;
      setEditProduct({
        id: id,
        name: productData.name || "",
        description: productData.description || "",
        availableQuantity: productData.availableQuantity || "",
        price: productData.price || "",
        categoryNames: new Set(
          productData.categories?.map((cat) => cat.name) || []
        ),
        toppingNames: new Set(
          productData.toppings?.map((top) => top.name) || []
        ),
        image: null,
      });
      setImagePreview(productData.imageUrl || null);
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage("Failed to load product data");
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

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditProduct((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (name) => {
    const trimmedName = name.trim();
    setEditProduct((prev) => {
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
    setEditProduct((prev) => {
      const newToppingNames = new Set(prev.toppingNames);
      if (newToppingNames.has(trimmedName)) {
        newToppingNames.delete(trimmedName);
      } else {
        newToppingNames.add(trimmedName);
      }
      return { ...prev, toppingNames: newToppingNames };
    });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append(
        "availableQuantity",
        parseFloat(editProduct.availableQuantity)
      );
      formData.append("price", editProduct.price);
      editProduct.categoryNames.forEach((name) =>
        formData.append("categoryNames", name)
      );
      editProduct.toppingNames.forEach((name) =>
        formData.append("toppingNames", name)
      );
      if (editProduct.image) formData.append("file", editProduct.image);

      const response = await ApiService.updateProduct(editProduct.id, formData);
      if (response.status === 200) {
        setMessage("Product updated successfully!");
        setTimeout(() => {
          navigate("/admin/products");
          setMessage("");
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="admin-product-list">
      <div className="product-header">
        <h2>Thay đổi sản phẩm</h2>
        <button className="add-btn" onClick={() => navigate("/admin/products")}>
          Quay lại
        </button>
      </div>
      {message && (
        <p className={`message ${message.includes("Failed") ? "error" : ""}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleEditProductSubmit} className="product-form">
        <label>Cập nhật ảnh:</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt={editProduct.name}
            className="image-preview"
          />
        )}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editProduct.name}
          onChange={handleProductChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editProduct.description}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          name="availableQuantity"
          placeholder="Available Quantity"
          value={editProduct.availableQuantity}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={editProduct.price}
          onChange={handleProductChange}
          required
        />
        <label>Danh mục:</label>
        <div className="checkbox-group">
          {allCategories.map((cat) => (
            <label key={cat.id} className="checkbox-label">
              <input
                type="checkbox"
                value={cat.name}
                onChange={() => handleCategoryChange(cat.name)}
                checked={editProduct.categoryNames.has(cat.name)}
              />
              {cat.name}
            </label>
          ))}
        </div>
        <label>Toppings:</label>
        <div className="checkbox-group">
          {allToppings.map((top) => (
            <label key={top.id} className="checkbox-label">
              <input
                type="checkbox"
                value={top.name}
                onChange={() => handleToppingChange(top.name)}
                checked={editProduct.toppingNames.has(top.name)}
              />
              {top.name}
            </label>
          ))}
        </div>
        <div className="modal-buttons">
          <button type="submit">Cập nhật</button>
          <button type="button" onClick={() => navigate("/admin/products")}>
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
