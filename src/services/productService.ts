
import { ProductData } from "../types/admin";
import { delay } from "./utils/apiUtils";
import { mockProducts } from "./mockData";
import env from "@/config/env";

// Homepage Products Management
export const getFeaturedProducts = async () => {
  await delay(800);
  const featured = mockProducts.filter(product => product.featured);
  return { products: featured };
};

export const getAllProducts = async () => {
  await delay(800);
  return { products: mockProducts };
};

export const postProductToHomepage = async (productData: ProductData) => {
  await delay(1000);
  const newProduct = {
    ...productData,
    id: (mockProducts.length + 1).toString(),
    featured: true
  };
  
  mockProducts.push(newProduct);
  return { product: newProduct };
};

export const updateProductOnHomepage = async (id: string, productData: Partial<ProductData>) => {
  await delay(1000);
  const productIndex = mockProducts.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new Error("Product not found");
  }
  
  mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
  return { product: mockProducts[productIndex] };
};

export const removeProductFromHomepage = async (id: string) => {
  await delay(1000);
  const productIndex = mockProducts.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new Error("Product not found");
  }
  
  // Instead of deleting, just mark as not featured
  mockProducts[productIndex].featured = false;
  return { success: true };
};

export const ProductService = {
  getFeaturedProducts,
  getAllProducts,
  postProductToHomepage,
  updateProductOnHomepage,
  removeProductFromHomepage
};
