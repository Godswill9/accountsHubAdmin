
// Base API URL - reading from environment variable with fallback
export const API_BASE_URL = 'https://aitool.asoroautomotive.com/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/admin-signup`,
  LOGIN: `${API_BASE_URL}/admin-login`,
  VERIFY_CODE: `${API_BASE_URL}/verify-admin-code`,
  LOGOUT: `${API_BASE_URL}/admin-logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/admin-forgot-password`,
  APPROVE_FORGOT_PASSWORD: `${API_BASE_URL}/approve-admin-forgot-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/admmin-change-password`,
  VERIFY_ADMIN: `${API_BASE_URL}/verifyAdmin`,
  VERIFY_PASSWORD_CHANGE: `${API_BASE_URL}/verifyAdminPasswordChange`,
};

// User endpoints
export const ADMIN_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/admins`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/admins/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/admins/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/admins/${id}`,
};

// Ticket endpoints
export const TICKET_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-ticket`,
  GET: `${API_BASE_URL}/ticket`,
  LIST: `${API_BASE_URL}/tickets`,
  UPDATE: `${API_BASE_URL}/update-ticket`,
  CLOSE: `${API_BASE_URL}/close-ticket`,
  ASSIGN: `${API_BASE_URL}/assign-ticket`,
};

// Digital Products endpoints
export const DIGITAL_PRODUCTS_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-digital-products`,
  DOWNLOAD: `${API_BASE_URL}/download-digital-products`,
  GET_ALL: `${API_BASE_URL}/digital-products`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/digital-products/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/digital-products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/digital-products/${id}`,
};

// Message endpoints
export const MESSAGE_ENDPOINTS = {
  SEND_USER: `${API_BASE_URL}/send-message`,
  SEND_ADMIN: `${API_BASE_URL}/send-message-admin`,
  FETCH_PER_TICKET: `${API_BASE_URL}/fetch-messages`,
  FETCH_ALL: `${API_BASE_URL}/fetch-all-messages`,
  MARK_SEEN_BY_USER: `${API_BASE_URL}/edit-message-seen-by-user`,
  SEND_EMAIL: `${API_BASE_URL}/send-message-mail`,
};

// File endpoints
export const FILE_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/upload-files`,
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/create-order`,
  GET: (id: string) => `${API_BASE_URL}/order/${id}`,
  LIST: `${API_BASE_URL}/orders`,
  UPDATE: `${API_BASE_URL}/update-order`,
  DELETE: (id: string) => `${API_BASE_URL}/order/${id}`,
};

// Wallet endpoints
export const WALLET_ENDPOINTS = {
  BALANCE: (walletId: string) => `${API_BASE_URL}/wallet/${walletId}/balance`,
  ADD_FUNDS: `${API_BASE_URL}/wallet/add-funds`,
  WITHDRAW_FUNDS: `${API_BASE_URL}/wallet/withdraw-funds`,
  TRANSFER_FUNDS: `${API_BASE_URL}/wallet/transfer-funds`,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_CRYPTO: `${API_BASE_URL}/payments/create-crypto-payment`,
  CREATE_CURRENCY: `${API_BASE_URL}/payments/create-currency-payment`,
  STATUS: (id: string) => `${API_BASE_URL}/payments/payment/${id}/status`,
  USER_PAYMENTS: (userId: string) => `${API_BASE_URL}/payments/${userId}/payments`,
  IPN: `${API_BASE_URL}/payments/ipn`,
  SAVE: `${API_BASE_URL}/payments`,
};
