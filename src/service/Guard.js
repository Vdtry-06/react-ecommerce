import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  return ApiService.isAuthenticated() ? element : <Navigate to="/login" replace state={{ from: location }} />;
};

export const AdminRoute = ({ element }) => {
  const location = useLocation();
  return ApiService.isAdmin() ? element : <Navigate to="/login" replace state={{ from: location }} />;
};

export const KEY_TOKEN = "accessToken";
export const KEY_ROLE = "role";
export const KEY_IS_LOGGED_IN = "isLoggedIn";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

export const setRole = (role) => {
  localStorage.setItem(KEY_ROLE, role);
};

export const getRole = () => {
  return localStorage.getItem(KEY_ROLE);
};

export const removeRole = () => {
  return localStorage.removeItem(KEY_ROLE);
};

export const setIsLoggedIn = (value) => {
  localStorage.setItem(KEY_IS_LOGGED_IN, value);
};

export const removeIsLoggedIn = () => {
  return localStorage.removeItem(KEY_IS_LOGGED_IN);
};