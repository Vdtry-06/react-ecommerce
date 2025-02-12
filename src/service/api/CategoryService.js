import axios from "axios";
import ApiService from "../api/ApiService";

export default class CategoryService {

    static BASE_URL = ApiService.BASE_URL;
    static getHeader() {
        return ApiService.getHeader();
    }

    static async addCategory(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/category/add`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async updateCategory(categoryId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/category/update/${categoryId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async getCategory(categoryId, request) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/category/get-category/${categoryId}`, request, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getAllCategories() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/category/get-categories`);
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/api/v1/category/delete/${categoryId}`);
        return response.data;
    }
}