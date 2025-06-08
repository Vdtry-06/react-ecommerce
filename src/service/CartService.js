import axios from "axios";
import ApiService from "./ApiService";

export const addToCart = async (userId, request) => {
  const response = await axios.post(`${ApiService.BASE_URL}/api/v1/cart/${userId}/add`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const updateCartItem = async (userId, request) => {
  const response = await axios.put(`${ApiService.BASE_URL}/api/v1/cart/${userId}/update`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const removeCartItem = async (userId, productId) => {
  const response = await axios.delete(`${ApiService.BASE_URL}/api/v1/cart/${userId}/remove/${productId}`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const getCart = async (userId) => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/cart/${userId}`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const toggleSelectItem = async (request) => {
  const response = await axios.put(`${ApiService.BASE_URL}/api/v1/cart/toggle-select`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const addToGuestCart = async (request) => {
  const response = await axios.post(`${ApiService.BASE_URL}/api/v1/cart/guest/add`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const getGuestCart = async (sessionId) => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/cart/guest/${sessionId}`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const mergeGuestCart = async (request) => {
  const response = await axios.post(`${ApiService.BASE_URL}/api/v1/cart/merge-guest-cart`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const getCartFromPendingOrders = async(userId) => {
    const response = await axios.get(`${ApiService.BASE_URL}/api/v1/cart/pending/${userId}`, {
        headers: ApiService.getHeader(),
    });
    return response.data;
}