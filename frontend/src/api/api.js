import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          error.message = data.error || "Bad request";
          break;
        case 404:
          error.message = data.error || "Resource not found";
          break;
        case 500:
          error.message = data.error || "Internal server error";
          break;
        default:
          error.message = data.error || `Error: ${status}`;
      }
    } else if (error.request) {
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

export default api;