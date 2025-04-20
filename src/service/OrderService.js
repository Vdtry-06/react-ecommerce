import axios from "axios";
import ApiService from "./ApiService";

export const createOrder = async (request) => {
  const response = await axios.post(`${ApiService.BASE_URL}/api/v1/orders`, request, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const getAllOrdersOfUser = async (userId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/orders/user-id/${userId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/orders/${orderId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axios.delete(
    `${ApiService.BASE_URL}/api/v1/orders/delete/${orderId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/orders/get-all`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const addOrderLine = async (orderId, request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/orders/${orderId}/order-lines`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const updateOrderLine = async (orderId, orderLineId, request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/orders/${orderId}/order-lines/${orderLineId}`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllOrderLines = async (orderId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/orders/${orderId}/order-lines`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteOrderLine = async (orderId, orderLineId) => {
  const response = await axios.delete(
    `${ApiService.BASE_URL}/api/v1/orders/${orderId}/order-lines/${orderLineId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};