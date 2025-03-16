import axios from "axios";

export const KEY_TOKEN = "accessToken";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem(KEY_TOKEN);
        return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
    }

    /* AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem(KEY_TOKEN);
        window.location.href = "/login"; // Chuyển hướng sau khi logout
    }
    
    static isAuthenticated() {
        const token = localStorage.getItem('accessToken');
        return token !== null && token !== undefined;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    /* Users API */
    static async getMyInfo() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/v1/auth/users/myInfo`, {
                headers: this.getHeader(),
            });
            console.log("API getMyInfo response:", response.data); // Debug response data
            return response.data;
        } catch (error) {
            console.error("Error in getMyInfo:", error);
            throw error;
        }
    }
    

    /* Address API */
    static async updateAddress(request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/addresses/update-address`, request, {
            headers: this.getHeader(),
        });
        return response.data;
    }


    /*Product */
    static async addProduct(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/product/add`, request, {
            headers: this.getHeader(),
            "Content-Type": "multipart/form-data",
        });
        return response.data;
    }

    static async updateProduct(productId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/product/update/${productId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "multipart/form-data",
        });
        return response.data;
    }

    static async getProduct(productId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get/${productId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getAllProduct() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get-all`, {
            headers: this.getHeader(),
        });
    
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/product/delete/${productId}`);
        return response.data;
    }

    static async FilterProductByCategories(categoryIds = []) {
        if (!Array.isArray(categoryIds)) {
            console.error("FilterProductByCategories expects an array, got:", categoryIds);
            return { products: [] }; // Tránh lỗi API
        }
    
        const query = categoryIds.length > 0 ? `?categoryIds=${categoryIds.join(",")}` : "";
        try {
            const response = await axios.get(`${this.BASE_URL}/api/v1/product/categories/filter${query}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            throw error; // Để frontend xử lý lỗi
        }
    }
    
    

    /* Product Enpoint User*/
    static async getProductByName(productName) {
        const response = await axios.get(
            `${this.BASE_URL}/api/v1/product/get-name-products/${productName}`,
            {
                headers: this.getHeader(), // Thêm token vào request
            }
        );
        return response.data;
    }

    /* Category */
    static async getCategory(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/category/get-category/${categoryId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getAllCategories() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/category/get-categories`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    /* Order */

    
}
