
import { apiClient } from "./apiClient";

export const getFeaturedProducts = async () => {
  const response = await apiClient.get('/api/featured-products');
  return response.data;
};

export const postProductToHomepage = async (productData: any) => {
  const response = await apiClient.post('/api/post-product-to-homepage', productData);
  return response.data;
};

export const updateProductOnHomepage = async (id: string, productData: any) => {
  const response = await apiClient.put('/api/update-product-on-homepage', { id, ...productData });
  return response.data;
};

export const removeProductFromHomepage = async (id: string) => {
  const response = await apiClient.delete(`/api/remove-product-from-homepage/${id}`);
  return response.data;
};
