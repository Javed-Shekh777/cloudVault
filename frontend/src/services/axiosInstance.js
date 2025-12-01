// src/services/axiosInstance.js
import axios from "axios";

/**
 * NOTE:
 * - This file DOES NOT import Redux store to avoid circular deps.
 * - It reads/writes accessToken from localStorage (simple approach).
 * - Refresh endpoint should be protected by httpOnly cookie set by backend.
 */

const baseURL = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true, // important for refresh cookie
});

// Request: attach access token from localStorage
instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
      

    const lockedToken = localStorage.getItem("lockedToken");
    const lockedSessionId = localStorage.getItem("lockedSessionId");
    console.log("Locked Token in Axios", lockedToken, lockedSessionId);

    if (lockedToken) config.headers["x-locked-lockedToken"] = lockedToken;
    if (lockedSessionId) config.headers["x-locked-lockedSessionId"] = lockedSessionId;



    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) { /* ignore */ }
  return config;
});

// Response: on 401 due to expired access token -> try refresh once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // If unauthorized due to expired token, try refresh flow
    if (status === 401 && message === "Invalid or expired access token") {
      if (originalRequest._retry) return Promise.reject(error);
      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // use raw axios (without interceptors) to call refresh
        const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken, user } = refreshRes.data;

        // set new tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        if (user) localStorage.setItem("user", JSON.stringify(user));

        processQueue(null, accessToken);
        isRefreshing = false;

        // update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // refresh failed -> clear local storage and let caller handle redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const axiosInstance = instance;
export default instance;
