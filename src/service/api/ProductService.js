import axios from "axios";

export default class ProductService {

    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }


    /* Product Enpoint */
    
    static async addProduct(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/product/add`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async updateProduct(productId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/product/update/${productId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async getProduct(productId, request) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get/${productId}`, request, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get-all`);
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/product/delete/${productId}`);
        return response.data;
    }

    static async getProductByNames(productName) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get-by-name/${productName}`);
        return response.data;
    }
}