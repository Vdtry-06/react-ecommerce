import axios from "axios";
import ApiService from "./ApiService";

export const addProduct = async (request) => {
  return await axios.post(`${ApiService.BASE_URL}/api/v1/product/add`, request, {
    headers: {
      ...ApiService.getHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = async (productId, request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/product/update/${productId}`,
    request,
    {
      headers: {
        ...ApiService.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const getProduct = async (productId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/product/get/${productId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllProduct = async () => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/product/get-all`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${ApiService.BASE_URL}/api/v1/product/delete/${id}`, {
    headers: ApiService.getHeader(),
  });
  return response;
};

export const FilterProductByCategories = async (categoryIds = []) => {
  if (!Array.isArray(categoryIds)) {
    console.error("FilterProductByCategories expects an array, got:", categoryIds);
    return { products: [] };
  }

  const query = categoryIds.length > 0 ? `?categoryIds=${categoryIds.join(",")}` : "";
  try {
    const response = await axios.get(
      `${ApiService.BASE_URL}/api/v1/product/categories/filter${query}`,
      {
        headers: ApiService.getHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};

export const getProductByName = async (productName) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/product/get-name-products/${productName}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const addReview = async (request) => {
  const response = await axios.post(
    `${ApiService.BASE_URL}/api/v1/reviews/add`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const updateReview = async (reviewId, request) => {
  const response = await axios.put(
    `${ApiService.BASE_URL}/api/v1/reviews/update/${reviewId}`,
    request,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(
    `${ApiService.BASE_URL}/api/v1/reviews/delete/${reviewId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getReview = async (reviewId) => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/reviews/get/${reviewId}`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(
    `${ApiService.BASE_URL}/api/v1/reviews/get-all`,
    {
      headers: ApiService.getHeader(),
    }
  );
  return response.data;
};