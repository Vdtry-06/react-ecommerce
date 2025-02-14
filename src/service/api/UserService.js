import axios from "axios";

export default class UserService {

    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /* Auth && Users API */

    static async registerUser(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/auth/signup`, request);
        return response.data;
    }

    static async loginUser(request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/auth/login`, request);
        return response.data;
    }

    static async getLoggedInUsersInfo() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/auth/users/myInfo`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateUser(request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/auth/users`, request);
        return response.data;
    }

    /* Admin API */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/auth/users/all`);
        return response.data;
    }

    static async deleteUser(userId) {
            const response = await axios.delete(`${this.BASE_URL}/api/v1/auth/users/${userId}`);
            return response.data;
        }

}