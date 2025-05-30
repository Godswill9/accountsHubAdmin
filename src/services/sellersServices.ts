import { API_BASE_URL } from "@/config/api";
import axios from "axios";

export const getAllSellers = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sellers`);
    return response.data.sellers; // Assuming the response contains a `sellers` array
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    throw error;
  }
};

// Get seller by ID
export const getSellerById = async (seller_Id: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sellers/${seller_Id}`);
    return response.data; // Assuming the response contains the seller object
  } catch (error) {
    console.error(`Error fetching seller with ID ${seller_Id}:`, error);
    throw error;
  }
};

// Update seller profile
export const updateseller = async (sellerId: string, sellerData: any): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sellers/${sellerId}`, sellerData);
    return response.data; // Assuming the response contains the updated seller object
  } catch (error) {
    console.error(`Error updating seller with ID ${sellerId}:`, error);
    throw error;
  }
};

// Delete seller account
export const deleteseller = async (sellerId: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sellers/${sellerId}`);
    return response.data; // Assuming the response confirms the deletion
  } catch (error) {
    console.error(`Error deleting seller with ID ${sellerId}:`, error);
    throw error;
  }
};
