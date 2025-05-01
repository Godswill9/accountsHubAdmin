
import axios from "axios";
import { toast } from "@/lib/toast";
import env from "@/config/env";

const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add token to the request if it exists
    const token = localStorage.getItem(env.ADMIN_TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear token and user data
      localStorage.removeItem(env.ADMIN_TOKEN_NAME);
      localStorage.removeItem(env.ADMIN_USER_NAME);
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    
    // Format error message for toast
    const errorMessage = response?.data?.message || error.message || env.DEFAULT_ERROR_MESSAGE;
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export { apiClient };
