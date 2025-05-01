
import { apiClient } from "./apiClient";

export const getUsers = async () => {
  const response = await apiClient.get('/api/users');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await apiClient.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/api/users/${id}`);
  return response.data;
};
