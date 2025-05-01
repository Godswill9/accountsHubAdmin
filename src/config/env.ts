// Configuration values from environment variables
const env = {
  // API BASE URL
  API_URL: import.meta.env.VITE_API_URL || '/',
  
  // JWT Token name in localStorage
  ADMIN_TOKEN_NAME: import.meta.env.VITE_ADMIN_TOKEN_NAME || 'adminToken',
  ADMIN_USER_NAME: import.meta.env.VITE_ADMIN_USER_NAME || 'adminUser',
  
  // Other configurations
  DEFAULT_ERROR_MESSAGE: 'An error occurred. Please try again.',
};

export default env;
