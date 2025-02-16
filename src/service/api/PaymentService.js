import axios from "axios";

export default class PaymentService {

  static BASE_URL = "http://localhost:8080";
  static getHeader() {
      const token = localStorage.getItem("token");
      return {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      };
  }
  
  static async createPayment(request) {
    const response = await axios.post(`${this.BASE_URL}/api/v1/payment`, request, {
        headers: this.getHeader(),
        "Content-Type": "application/json",
      }
    );
    return response.data;
  }

  static async pay(orderId) {
    const response = await axios.get(`${this.BASE_URL}/api/v1/payments/vn-pay`, {
        headers: this.getHeader(),
        params: { orderId },
      }
    );
    return response.data;
  }

  static async payCallback(queryParams) {
    const response = await axios.get(`${this.BASE_URL}/api/v1/payments/vn-pay-callback`, {
        headers: this.getHeader(),
        params: queryParams,
      }
    );
    return response.data;
  }
}
