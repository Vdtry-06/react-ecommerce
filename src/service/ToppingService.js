import axios from "axios";
import ApiService from "./ApiService";

export const addTopping = async (request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/topping/add`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const updateTopping = async (toppingId, request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/topping/update/${toppingId}`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteTopping = async (toppingId) => {
  const response = await axios.delete(
    `${ApiService.BASE_URL}/api/v1/topping/delete/${toppingId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getTopping = async (toppingId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/topping/get-topping/${toppingId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllToppings = async () => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/topping/get-all`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};