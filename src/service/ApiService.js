import axios from "axios";
import * as AddressService from "./AddressService";
import * as CategoryService from "./CategoryService";
import * as OrderService from "./OrderService";
import * as PaymentService from "./PaymentService";
import * as ProductService from "./ProductService";
import * as ToppingService from "./ToppingService";
import * as UserService from "./UserService";

export const KEY_TOKEN = "accessToken";
export const KEY_ROLE = "role";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    const token = localStorage.getItem(KEY_TOKEN);
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  }

  static logout() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_ROLE);
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChanged"));
  }

  static isAuthenticated() {
    return Boolean(localStorage.getItem(KEY_TOKEN));
  }

  static isAdmin() {
    return localStorage.getItem(KEY_ROLE)?.toUpperCase() === "ADMIN";
  }

  /* Axios Interceptors */
  static setupInterceptors() {
    axios.interceptors.response.use(
      (response) => {
        // Check for HTML response indicating unauthorized access
        if (
          response.headers["content-type"]?.includes("text/html") &&
          typeof response.data === "string" &&
          response.data.includes("<!DOCTYPE html")
        ) {
          console.warn("Unauthorized: HTML login page received, logging out...");
          this.logout();
          return Promise.reject(new Error("Unauthorized: HTML login page received"));
        }
        return response;
      },
      (error) => {
        if (error.response) {
          // Handle 401 or HTML response
          if (
            error.response.status === 401 ||
            (error.response.headers["content-type"]?.includes("text/html") &&
              typeof error.response.data === "string" &&
              error.response.data.includes("<!DOCTYPE html"))
          ) {
            console.warn("Token expired or unauthorized, logging out...");
            this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Export domain-specific services
  static Address = AddressService;
  static Category = CategoryService;
  static Order = OrderService;
  static Payment = PaymentService;
  static Product = ProductService;
  static Topping = ToppingService;
  static User = UserService;
}

// Set up Axios interceptors
ApiService.setupInterceptors();