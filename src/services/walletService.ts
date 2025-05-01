
import { apiClient } from "./apiClient";

export const getWalletBalance = async (walletId: string) => {
  const response = await apiClient.get(`/api/wallet/${walletId}/balance`);
  return response.data;
};

export const addFunds = async (walletData: any) => {
  const response = await apiClient.post('/api/wallet/add-funds', walletData);
  return response.data;
};

export const withdrawFunds = async (walletData: any) => {
  const response = await apiClient.post('/api/wallet/withdraw-funds', walletData);
  return response.data;
};

export const transferFunds = async (transferData: any) => {
  const response = await apiClient.post('/api/wallet/transfer-funds', transferData);
  return response.data;
};
