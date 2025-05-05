import axios from "axios";
import ApiService from "./ApiService";

export const login = async (email, password) => {
  const response = await axios.post(`${ApiService.BASE_URL}/api/v1/auth/login`, { email, password });
  return response.data;
};

export const getMyInfo = async () => {
  try {
    const response = await axios.get(
      `${ApiService.BASE_URL}/api/v1/auth/users/myInfo`,
      {
        headers: ApiService.getHeader(),
      }
    );
    // Check if response is HTML (indicating unauthorized redirect)
    if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html")) {
      throw new Error("Unauthorized: HTML login page received");
    }
    console.log("API getMyInfo response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getMyInfo:", error);
    throw error;
  }
};

export const updateUser = async (userId, request) => {
  try {
    const response = await axios.put(`${ApiService.BASE_URL}/api/v1/auth/users/${userId}`, request, {
      headers: {
        ...ApiService.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("API updateUser response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${ApiService.BASE_URL}/api/v1/auth/users/${userId}`, {
      headers: ApiService.getHeader(),
    });
    console.log("API getUser response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getUser:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  const response = await axios.get(`${ApiService.BASE_URL}/api/v1/auth/users/all`, {
    headers: ApiService.getHeader(),
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${ApiService.BASE_URL}/api/v1/auth/users/${userId}`);
  return response.data;
};

export const getUserInfoById = async (userId) => {
  try {
    const response = await axios.get(`${ApiService.BASE_URL}/api/v1/auth/users/${userId}/info`, {
      headers: ApiService.getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const sendMessage = async (message) => {
  try {
    console.log("Sending message to chatbot:", message)
    console.log("API URL:", `${ApiService.BASE_URL}/api/v1/chatbot/ask`)

    const response = await axios.post(
      `${ApiService.BASE_URL}/api/v1/chatbot/ask`, // Correct URL format
      { text: message },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    console.log("Chatbot response:", response.data)

    // Check if response is HTML (indicating unauthorized redirect)
    if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html")) {
      throw new Error("Unauthorized: HTML login page received")
    }

    return response.data
  } catch (error) {
    console.error("Chatbot error:", error)
    console.error("Error details:", error.response?.data || error.message)

    // Provide a more user-friendly error message
    if (error.response?.status === 401) {
      throw new Error("Bạn cần đăng nhập để sử dụng chatbot")
    } else if (error.response?.status === 429) {
      throw new Error("Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau")
    } else {
      throw new Error(error.response?.data?.text || error.response?.data?.message || "Không thể kết nối đến chatbot")
    }
  }
}