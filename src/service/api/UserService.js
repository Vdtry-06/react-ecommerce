import axios from "axios";

export const KEY_TOKEN = "accessToken";

export const setToken = (token) => {
    localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
    return localStorage.removeItem(KEY_TOKEN);
}

export const logOut = () => {
    removeToken();
};

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

    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/auth/users/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateUser(userId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/auth/users/${userId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "multipart/form-data",
        });
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