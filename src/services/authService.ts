
import { apiClient } from "./apiClient";
import { AUTH_ENDPOINTS, ADMIN_ENDPOINTS } from "@/config/api";

interface SignupData {
  name: string;
  email: string;
  password: string;
  code: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyCodeData {
  email: string;
  code: string;
}

interface ForgotPasswordData {
  email: string;
  resetCode: string;
}

interface ApproveForgotPasswordData {
  email: string;
  code: string;
}

interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

// Helper function for API requests with environment-aware logging
const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    // For debugging in development only
    if (import.meta.env.DEV) {
      console.log(`Making ${method} request to: ${url}`);
      if (data) console.log('Request data:', data);
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies/sessions
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const adminSignup = async (data: SignupData) => {
  return await apiRequest(AUTH_ENDPOINTS.SIGNUP, 'POST', data);
};

export const adminLogin = async (data: LoginData) => {
  return await apiRequest(AUTH_ENDPOINTS.LOGIN, 'POST', data);
};

export const adminVerifyCode = async (data: VerifyCodeData) => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_CODE, 'POST', data);
};

export const adminLogout = async () => {
  return await apiRequest(AUTH_ENDPOINTS.LOGOUT, 'POST');
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, 'POST', data);
};

export const adminApproveForgotPassword = async (data: ApproveForgotPasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.APPROVE_FORGOT_PASSWORD, 'POST', data);
};

export const adminChangePassword = async (data: ChangePasswordData) => {
  return await apiRequest(AUTH_ENDPOINTS.CHANGE_PASSWORD, 'POST', data);
};

export const getAdmins = async () => {
  return await apiRequest(ADMIN_ENDPOINTS.GET_ALL, 'GET');
};

export const getAdminProfile = async (id: string) => {
  return await apiRequest(ADMIN_ENDPOINTS.GET_BY_ID(id), 'GET');
};

export const updateAdmin = async (id: string, AdminData: any) => {
  return await apiRequest(ADMIN_ENDPOINTS.UPDATE(id), 'PUT', AdminData);
};

export const deleteAdmin = async (id: string) => {
  return await apiRequest(ADMIN_ENDPOINTS.DELETE(id), 'DELETE');
};

export const verifyAdmin = async () => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_ADMIN, 'GET');
};

export const verifyUser = async (): Promise<User | null> => {
  try {
    // In a real app, this would verify the user's token with the API
    // For now, we'll just return a mock user if there's a token
    const token = localStorage.getItem('userToken');
    if (token) {
      return {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Test User'
      };
    }
    return null;
  } catch (error) {
    console.error('User verification error:', error);
    return null;
  }
};

export const verifyAdminPasswordChange = async () => {
  return await apiRequest(AUTH_ENDPOINTS.VERIFY_PASSWORD_CHANGE, 'GET');
};

export const changePassword = async (data: ChangePasswordData) => {
  // In a real app, this would call an API endpoint
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const authService = {
  adminSignup,
  adminLogin,
  adminLogout,
  adminVerifyCode,
  forgotPassword,
  adminApproveForgotPassword,
  adminChangePassword,
  verifyAdmin,
  verifyUser,
  getAdmins,
  getAdminProfile,
  updateAdmin,
  deleteAdmin,
  verifyAdminPasswordChange,
  changePassword
};
