import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// Get all coupons
export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coupons`,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Get a coupon by ID
export const getCouponById = async (couponId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coupon/${couponId}`,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching coupon with ID ${couponId}:`, error);
    throw error;
  }
};

// Create a new coupon
export const createCoupon = async (couponData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-coupon`, couponData,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

// Update coupon usage
export const updateCouponUsed = async (couponId: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateCouponUsed/${couponId}`,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon usage for ID ${couponId}:`, error);
    throw error;
  }
};

// Update coupon value
export const updateCouponValue = async (couponId: string, valueData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-coupon-value/${couponId}`, valueData,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon value for ID ${couponId}:`, error);
    throw error;
  }
};

// Delete a coupon
export const deleteCoupon = async (couponId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-coupon/${couponId}`,{
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting coupon with ID ${couponId}:`, error);
    throw error;
  }
};