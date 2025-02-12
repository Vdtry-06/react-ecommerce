import axios from "axios";
import ApiService from "../api/ApiService";

export default class PaymentService {

  static BASE_URL = ApiService.BASE_URL;
  static getHeader() {
      return ApiService.getHeader();
  }

  static async createPayment(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/payments`,
      request,
      {
        headers: this.getHeader(),
        "Content-Type": "application/json",
      }
    );
    return response.data;
  }

  static async pay(orderId) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/payments/vn-pay`,
      {
        headers: this.getHeader(),
        params: { orderId },
      }
    );
    return response.data;
  }

  static async payCallback(queryParams) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/payments/vn-pay-callback`,
      {
        headers: this.getHeader(),
        params: queryParams,
      }
    );
    return response.data;
  }
}
