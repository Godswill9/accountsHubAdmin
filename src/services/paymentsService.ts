
import { apiClient } from "./apiClient";

export const getPayments = async () => {
  const response = await apiClient.get('/api/payments', {
      withCredentials: true
    });
  return response.data;
};

export const getUserPayments = async (userId: string) => {
  const response = await apiClient.get(`/api/${userId}/payments`, {
      withCredentials: true
    });
  return response.data;
};

export const deletePayment = async (userId: string) => {
  const response = await apiClient.delete(`/api/payments/${userId}`, {
      withCredentials: true
    });
  return response.data;
};

export const createCryptoPayment = async (paymentData: any) => {
  const response = await apiClient.post('/api/create-crypto-payment', paymentData, {
      withCredentials: true
    });
  return response.data;
};

export const createCurrencyPayment = async (paymentData: any) => {
  const response = await apiClient.post('/api/create-currency-payment', paymentData, {
      withCredentials: true
    });
  return response.data;
};

export const getPaymentStatus = async (paymentId: string) => {
  const response = await apiClient.get(`/api/payment/${paymentId}/status`, {
      withCredentials: true
    });
  return response.data;
};
