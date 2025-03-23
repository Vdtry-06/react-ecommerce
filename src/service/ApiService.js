import axios from "axios";

export const KEY_TOKEN = "accessToken";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    const token = localStorage.getItem(KEY_TOKEN);
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};
  }

  /* AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem(KEY_TOKEN);
    window.location.href = "/login"; // Chuyển hướng sau khi logout
  }

  static isAuthenticated() {
    const token = localStorage.getItem(KEY_TOKEN);
    return token !== null && token !== undefined;
  }

  static isAdmin() {
    const role = localStorage.getItem("role")?.trim().toUpperCase(); // Chuẩn hóa role
    console.log("Role in localStorage:", role);
    return role === "ADMIN";
  }

  static async login(email, password) {
    const response = await axios.post(`${this.BASE_URL}/api/v1/auth/login`, {
      email,
      password,
    });
    return response.data;
  }

  /* Users API */
  static async getMyInfo() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/api/v1/auth/users/myInfo`,
        {
          headers: this.getHeader(),
        }
      );
      console.log("API getMyInfo response:", response.data); // Debug response data
      return response.data;
    } catch (error) {
      console.error("Error in getMyInfo:", error);
      throw error;
    }
  }

  /* Address API */

  static async addAddress(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/addresses/add-address`,
      request,
      {
        headers: this.getHeader(),
        "Content-Type": "application/json",
      }
    );
    return response.data;
  }

  static async updateAddress(request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/addresses/update-address`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /*Product */
  static async addProduct(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/product/add`,
      request,
      {
        headers: this.getHeader(),
        "Content-Type": "multipart/form-data",
      }
    );
    return response.data;
  }

  static async updateProduct(productId, request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/product/update/${productId}`,
      request,
      {
        headers: this.getHeader(),
        "Content-Type": "multipart/form-data",
      }
    );
    return response.data;
  }

  static async getProduct(productId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/product/get/${productId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllProduct() {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/product/get-all`,
      {
        headers: this.getHeader(),
      }
    );

    return response.data;
  }

  static async deleteProduct(productId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/product/delete/${productId}`
    );
    return response.data;
  }

  static async FilterProductByCategories(categoryIds = []) {
    if (!Array.isArray(categoryIds)) {
      console.error(
        "FilterProductByCategories expects an array, got:",
        categoryIds
      );
      return { products: [] }; // Tránh lỗi API
    }

    const query =
      categoryIds.length > 0 ? `?categoryIds=${categoryIds.join(",")}` : "";
    try {
      const response = await axios.get(
        `${this.BASE_URL}/api/v1/product/categories/filter${query}`,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error; // Để frontend xử lý lỗi
    }
  }

  /* Admin Process Topping API */
  static async addTopping(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/topping/add`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateTopping(toppingId, request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/topping/update/${toppingId}`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteTopping(toppingId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/topping/delete/${toppingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* User use Topping API */
  static async getTopping(toppingId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/topping/get-topping/${toppingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllToppings() {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/topping/get-all`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
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
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/category/get-category/${categoryId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllCategories() {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/category/get-categories`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Admin Process Category */

  static async addCategory(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/category/add`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateCategory(categoryId, request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/category/update/${categoryId}`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteCategory(categoryId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/category/delete/${categoryId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Order */
  static async createOrder() {
    const response = await axios.post(`${this.BASE_URL}/api/v1/orders`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllOrdersOfUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/orders/user-id/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getOrderById(orderId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/orders/${orderId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteOrder(orderId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/orders/delete/${orderId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Admin process Orders */
  static async getAllOrders() {
    const response = await axios.get(`${this.BASE_URL}/api/v1/orders/get-all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  /* Order Detail */
  static async addOrderLine(orderId, request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/orders/${orderId}/order-lines`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateOrderLine(orderId, orderLineId, request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/orders/${orderId}/order-lines/${orderLineId}`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllOrderLines(orderId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/orders/${orderId}/order-lines`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteOrderLine(orderId, orderLineId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/orders/${orderId}/order-lines/${orderLineId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Review */
  static async addReview(request) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/reviews/add`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateReview(reviewId, request) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/reviews/update/${reviewId}`,
      request,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteReview(reviewId) {
    const response = await axios.delete(
      `${this.BASE_URL}/api/v1/reviews/delete/${reviewId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getReview(reviewId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/reviews/get/${reviewId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Admin process Reviews */
  static async getAllReviews() {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/reviews/get-all`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* Axios Interceptors */
  static setupInterceptors() {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token has expired or is invalid
          ApiService.logout();
        }
        return Promise.reject(error);
      }
    );
  }
}

// Set up Axios interceptors
ApiService.setupInterceptors();
