import axios from "axios";
import ApiService from "./ApiService";

export const addAddress = async (request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/addresses/add-address`,
    request,
    {
      headers: ApiService.getHeader(),
      "Content-Type": "application/json",
    }
  );
  return response.data;
};

export const updateAddress = async (request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/addresses/update-address`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAddress = async (id) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/addresses/get-address/${id}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAddresses = async () => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/addresses/get-all`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};