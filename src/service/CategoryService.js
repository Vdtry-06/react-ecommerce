import axios from "axios";
import ApiService from "./ApiService";

export const getCategory = async (categoryId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/category/get-category/${categoryId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/category/get-categories`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const addCategory = async (request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/category/add`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const updateCategory = async (categoryId, request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/category/update/${categoryId}`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await axios.delete(
    `${ApiService.BASE_URL}/api/v1/category/delete/${categoryId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};