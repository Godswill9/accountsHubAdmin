
// import { ProductData } from "../types/admin";
// import { delay } from "./utils/apiUtils";
// import { mockProducts } from "./mockData";
// import env from "@/config/env";

// // Homepage Products Management
// export const getFeaturedProducts = async () => {
//   await delay(800);
//   const featured = mockProducts.filter(product => product.featured);
//   return { products: featured };
// };

// export const getAllProducts = async () => {
//   await delay(800);
//   return { products: mockProducts };
// };

// export const postProductToHomepage = async (productData: ProductData) => {
//   await delay(1000);
//   const newProduct = {
//     ...productData,
//     id: (mockProducts.length + 1).toString(),
//     featured: true
//   };
  
//   mockProducts.push(newProduct);
//   return { product: newProduct };
// };

// export const updateProductOnHomepage = async (id: string, productData: Partial<ProductData>) => {
//   await delay(1000);
//   const productIndex = mockProducts.findIndex(product => product.id === id);
  
//   if (productIndex === -1) {
//     throw new Error("Product not found");
//   }
  
//   mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
//   return { product: mockProducts[productIndex] };
// };

// export const removeProductFromHomepage = async (id: string) => {
//   await delay(1000);
//   const productIndex = mockProducts.findIndex(product => product.id === id);
  
//   if (productIndex === -1) {
//     throw new Error("Product not found");
//   }
  
//   // Instead of deleting, just mark as not featured
//   mockProducts[productIndex].featured = false;
//   return { success: true };
// };

// export const ProductService = {
//   getFeaturedProducts,
//   getAllProducts,
//   postProductToHomepage,
//   updateProductOnHomepage,
//   removeProductFromHomepage
// };



import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface Product {
  id: string;
  category: string;
  platform_name: string;
  description: string;
  price: string;
  stock_quantity: number;
  imageUrl?: string;
  important_notice: string;
  data_format: string; // 👈 Required here
  on_homepage?: string;
date_created?: string;

}

export const DIGITAL_PRODUCTS_ENDPOINTS = {
  FEATURED: `${API_BASE_URL}/featured-products`,
  ALL: `${API_BASE_URL}/digital-products`,
  DETAILS: (id: string) => `${API_BASE_URL}/digital-products/${id}`,
  DOWNLOAD: `${API_BASE_URL}/download-digital-products`,
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(DIGITAL_PRODUCTS_ENDPOINTS.FEATURED);
    return response.data.featuredProducts || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(DIGITAL_PRODUCTS_ENDPOINTS.ALL);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const fetchProductDetails = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(DIGITAL_PRODUCTS_ENDPOINTS.DETAILS(id));
    // console.log(response.data)
    return response.data.file1;
  } catch (error) {
    console.error(`Error fetching product details for ID ${id}:`, error);
    throw error;
  }
};
