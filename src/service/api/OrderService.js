import axios from "axios";
import ApiService from "../api/ApiService";

export default class OrderService {

    static BASE_URL = ApiService.BASE_URL;
    static getHeader() {
        return ApiService.getHeader();
    }

    static async addOrder(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/orders`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async getOrder(orderId, request) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/orders/${orderId}`, request, {
            headers: this.getHeader(),
        });
        return response.data;
    }   

    static async getAllOrders() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/orders/get-all`);
        return response.data;
    }

    static async deleteOrder(orderId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/orders/delete/${orderId}`);
        return response.data;
    }

    static async createOrderLine(orderId, request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/orders/${orderId}/order-lines`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }
    static async updateOrderLine(orderId, orderLineId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/orders/${orderId}/order-lines/${orderLineId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }
    
    static async deleteOrderLine(orderLineId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/orders/order-lines/${orderLineId}`);
        return response.data;
    }

    static async getAllOrderLinesByOrderId(orderId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/orders/${orderId}/order-lines`);
        return response.data;
    }
}