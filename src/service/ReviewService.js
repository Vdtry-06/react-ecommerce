import axios from "axios";
import ApiService from "./ApiService";

export const addReview = async (request) => {
    try {
        const response = await axios.post(
        `${ApiService.BASE_URL}/api/v1/reviews/add`,
        request,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}

export const updateReview = async (reviewId, request) => {
    try {
        const response = await axios.put(
        `${ApiService.BASE_URL}/api/v1/reviews/update/${reviewId}`,
        request,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
}

export const adminUpdateReview = async (reviewId, request) => {
    try {
        const response = await axios.put(
        `${ApiService.BASE_URL}/api/v1/reviews/admin/update/${reviewId}`,
        request,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
}

export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(
        `${ApiService.BASE_URL}/api/v1/reviews/delete/${reviewId}`,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
}

export const getReview = async (reviewId) => {
    try {
        const response = await axios.get(
        `${ApiService.BASE_URL}/api/v1/reviews/get/${reviewId}`,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}

export const getAllReviews = async () => {
    try {
        const response = await axios.get(
        `${ApiService.BASE_URL}/api/v1/reviews/get-all`,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        throw error;
    }
}

export const toggleVisibility = async (reviewId) => {
    try {
        const response = await axios.put(
        `${ApiService.BASE_URL}/api/v1/reviews/toggle-visibility/${reviewId}`,
        {},
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error toggling review visibility:", error);
        throw error;
    }
}   

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await axios.get(
        `${ApiService.BASE_URL}/api/v1/reviews/product/${productId}`,
        {
            headers: ApiService.getHeader(),
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews by product ID:", error);
        throw error;
    }
}