import axios from "axios";
import * as AddressService from "./AddressService";
import * as CategoryService from "./CategoryService";
import * as OrderService from "./OrderService";
import * as PaymentService from "./PaymentService";
import * as ProductService from "./ProductService";
import * as ToppingService from "./ToppingService";
import * as UserService from "./UserService";
import * as ReviewService from "./ReviewService";
import { getToken, removeToken, getRole, removeRole, removeIsLoggedIn } from "./localStorage";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {};
  }

  static logout() {
    removeToken();
    removeRole();
    removeIsLoggedIn();
    window.dispatchEvent(new Event("authChanged"));
  }

  static isAuthenticated() {
    return Boolean(getToken());
  }

  static isAdmin() {
    return getRole()?.toUpperCase() === "ADMIN";
  }

  static setupInterceptors() {
    axios.interceptors.response.use(
      (response) => {
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

  static Address = AddressService;
  static Category = CategoryService;
  static Order = OrderService;
  static Payment = PaymentService;
  static Product = ProductService;
  static Topping = ToppingService;
  static User = UserService;
  static Review = ReviewService;
}

ApiService.setupInterceptors();