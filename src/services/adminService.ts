
// Re-export all admin-related services from specialized modules
// This maintains backward compatibility with existing imports

export * from './authService';

// Export digital products service functions
export * from './messagesService'; 

// Export homepage service functions
export * from './homepageService';

// Export utility functions
export { apiWrapper } from './utils/apiUtils';

// Export specific functions from other services to avoid naming conflicts
export { getAllUsers } from './userService';
export { getMetrics, getOrders } from './analyticsService';

// Export product service functions with explicit naming to avoid conflicts
export {
  fetchAllProducts,
  fetchFeaturedProducts as getProductServiceFeaturedProducts,
  fetchProductDetails,
}
from './productService';
