import UserService from "./api/UserService";
import AddressService from "./api/AddressService";
import ProductService from "./api/ProductService";
import CategoryService from "./api/CategoryService";
import OrderService from "./api/OrderService";
import PaymentService from "./api/PaymentService";
import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /* AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }
    
    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }
    
    /* AUTH && USERS API */
    // static UserService = UserService;

    // /* ADDRESS API */
    // static AddressService = AddressService;

    // /* PRODUCT ENPOINT */
    // static ProductService = ProductService

    // /* CATEGORY ENDPOINT */
    // static CategoryService = CategoryService;

    // /* ORDER ENDPOINT */
    // static OrderService = OrderService;

    // /* PAYMENT ENDPOINT */
    // static PaymentService = PaymentService;

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

    /* Product Enpoint User*/
    static async getProductByName(productName) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/product/get-name-products/${productName}`);
        return response.data;
    }
}
