import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/adminPage.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    availableQuantity: "",
    price: "",
    categoryName: "",
    toppingNames: new Set(),
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allToppings, setAllToppings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllCategories();
    fetchAllToppings();
  }, []);

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
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (name) => {
    setNewProduct((prev) => ({ ...prev, categoryName: name }));
  };

  const handleToppingChange = (name) => {
    const trimmedName = name.trim();
    setNewProduct((prev) => {
      const newToppingNames = new Set(prev.toppingNames);
      if (newToppingNames.has(trimmedName)) {
        newToppingNames.delete(trimmedName);
      } else {
        newToppingNames.add(trimmedName);
      }
      return { ...prev, toppingNames: newToppingNames };
    });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("availableQuantity", parseFloat(newProduct.availableQuantity));
      formData.append("price", newProduct.price);
      formData.append("categoryName", newProduct.categoryName);
      newProduct.toppingNames.forEach((name) => formData.append("toppingNames", name));
      if (newProduct.image) formData.append("file", newProduct.image);

      const response = await ApiService.addProduct(formData);
      console.log("Add product response:", response); // Log phản hồi để debug

      if (response.status === 200 || response.status === 201) { // Chấp nhận cả 200 và 201
        setMessage("Product added successfully!");
        setNewProduct({
          name: "",
          description: "",
          availableQuantity: "",
          price: "",
          categoryName: "",
          toppingNames: new Set(),
          image: null,
        });
        setImagePreview(null);
        setTimeout(() => {
          navigate("/admin/products");
          setMessage("");
        }, 1000);
      } else {
        setMessage(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add product");
      console.error("Error adding product:", error.response || error);
    }
  };

  return (
    <div className="admin-product-list">
      <h2>Thêm mới sản phẩm</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleAddProductSubmit} className="product-form">
        <label>Cập nhật ảnh:</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleProductChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          name="availableQuantity"
          placeholder="Available Quantity"
          value={newProduct.availableQuantity}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleProductChange}
          required
        />
        <label>Danh mục:</label>
        <div className="radio-group">
          {allCategories.map((cat) => (
            <label key={cat.id} className="radio-label">
              <input
                type="radio"
                name="categoryName"
                value={cat.name}
                onChange={() => handleCategoryChange(cat.name)}
                checked={newProduct.categoryName === cat.name}
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
                checked={newProduct.toppingNames.has(top.name)}
              />
              {top.name}
            </label>
          ))}
        </div>
        <div className="modal-buttons">
          <button type="submit">Thêm sản phẩm</button>
          <button type="button" onClick={() => navigate("/admin/products")}>
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;