import axios from "axios";

export default class AddressService {

    static BASE_URL = "http://localhost:8080";
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /* Address API */

    static async createAddress(userId, request) {
        const response = await axios.post(`${this.BASE_URL}/api/v1/addresses/user-id/${userId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async updateAddress(userId, request) {
        const response = await axios.put(`${this.BASE_URL}/api/v1/addresses/update-address/user-id/${userId}`, request, {
            headers: this.getHeader(),
            "Content-Type": "application/json",
        });
        return response.data;
    }

    static async getAddress(userId, addressId) {
        const response = await axios.get(`${this.BASE_URL}/api/v1/addresses/${addressId}/user-id/${userId}` ,{
            headers: this.getHeader(),
        });
        return response.data;
    }

    /* Admin API */
    static async getAddresses() {
        const response = await axios.get(`${this.BASE_URL}/api/v1/address`);
        return response.data;
    }

}