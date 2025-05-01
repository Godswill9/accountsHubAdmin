
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface CryptoPaymentRequest {
  price_amount: number;
  order_id: string;
  order_description: string;
}

export interface CurrencyPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  payment_method_types: string[];
}

export interface PaymentSaveRequest {
  payment_type: 'order' | 'wallet_funding';
  payment_status: 'pending' | 'completed';
  payment_gateway: 'stripe' | 'crypto currency' | 'wallet';
  amount: number;
  transaction_type: 'deposit' | 'order';
  ref: string;
  user_id: string;
}

export interface PaymentResponse {
  message: string;
  data?: any;
  status?: string;
  sessionId?: string;
  error?: string;
  amount: number;
  created_at: string;
  payment_gateway: string;
  payment_id: string;
  payment_status: string;
 payment_type: string;
  transaction_type:string
   user_id:string
}

export const createCryptoPayment = async (paymentData: CryptoPaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/create-crypto-payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating crypto payment:', error);
    throw error;
  }
};

export const createCurrencyPayment = async (paymentData: CurrencyPaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/create-currency-payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating currency payment:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/payment/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

export const getUserPayments = async (userId: string): Promise<{ payments: any[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/${userId}/payments`);
    return response.data;
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw error;
  }
};

export const savePaymentDetails = async (paymentData: PaymentSaveRequest): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error saving payment details:', error);
    throw error;
  }
};

export const getAllPayments = async (): Promise<{ payments: any[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments`);
    return response.data
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw error;
  }
};
export const deletePayment = async (userId: string): Promise<{ payments: any[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payments/${userId}`);
    return response.data
  } catch (error) {
    console.error('Error deleting payments:', error);
    throw error;
  }
};
