import axios from "axios";

const API = axios.create({
  baseURL:"https://studen-managemnet.onrender.com";,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
