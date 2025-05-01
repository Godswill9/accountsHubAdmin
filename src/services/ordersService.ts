
import { apiClient } from "./apiClient";

export const getOrders = async () => {
  const response = await apiClient.get('/api/orders');
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await apiClient.get(`/api/order/${orderId}`);
  return response.data;
};

export const getUserOrders = async (userId: string) => {
  const response = await apiClient.get(`/api/orders/user/${userId}`);
  return response.data;
};

export const updateOrder = async (orderData: any) => {
  const response = await apiClient.put('/api/update-order', orderData);
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await apiClient.delete(`/api/order/${orderId}`);
  return response.data;
};
