import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/addCategory.css";
// import "../../static/style/editCategory.css";

const EditCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('')
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (categoryId) fetchCategory(categoryId);
    }, [categoryId]);
    

    const fetchCategory = async (id) => {
        try {
            const response = await ApiService.getCategory(id);
            if (response.data) {
                setName(response.data.name || '');
                setDescription(response.data.description || '');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to get category");
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.updateCategory(categoryId, { name, description });
            if (response.data && response.data.id) {
                setMessage("Update Successfully!");
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories");
                }, 3000);
            }            
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Failed to save a category")
        }
    }

    return (
        <div className="add-category-page">
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Edit Category</h2>
                <input type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />

                <button type="submit">Update</button>
            </form>
        </div>
    )
    
}

export default EditCategory;