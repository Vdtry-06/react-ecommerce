import axios from "axios";
import ApiService from "./ApiService";

export const createVNPayPaymentForSelectedItems = async (request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/payment/vn-pay-selected`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const payCallback = async (params) => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/payment/vn-pay-callback`, {
    params,
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const cancelPayment = async(orderId) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/payment/${orderId}/cancel`,
    {},
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
}