import UserService from "./api/UserService";
import ProductService from "./api/ProductService";
import CategoryService from "./api/CategoryService";
import OrderService from "./api/OrderService";
import PaymentService from "./api/PaymentService";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }
    
    /* AUTH && USERS API */
    static UserService = UserService;

    /* PRODUCT ENPOINT */
    static ProductService = ProductService

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

    /* CATEGORY ENDPOINT */
    static CategoryService = CategoryService;

    /* ORDER ENDPOINT */
    static OrderService = OrderService;

    /* PAYMENT ENDPOINT */
    static PaymentService = PaymentService;

}