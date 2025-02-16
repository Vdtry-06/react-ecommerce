import axios from "axios";

export default class OrderService {

    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    static async createOrder(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/orders`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async getOrderById(orderId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/orders/${orderId}`, {
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

    static async addOrderLine(orderId, request) {
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
    
    static async removeOrderLine(orderLineId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/orders/order-lines/${orderLineId}`);
        return response.data;
    }

    static async getOrderLines(orderId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/orders/${orderId}/order-lines`);
        return response.data;
    }
}