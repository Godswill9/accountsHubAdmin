
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

import { ORDER_ENDPOINTS } from '@/config/api';

export const createOrder = async (orderData: any) => {
  try {
    const response = await axios.post(ORDER_ENDPOINTS.CREATE, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET(orderId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    const orders = response.data
  console.log(orders)
    return orders.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrder = async (orderData: any) => {
  try {
    const response = await axios.put(ORDER_ENDPOINTS.UPDATE, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await axios.delete(ORDER_ENDPOINTS.DELETE(orderId));
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};

const getAllPayments = async (): Promise<{ payments: any[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments`);
    return response.data
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw error;
  }
};
