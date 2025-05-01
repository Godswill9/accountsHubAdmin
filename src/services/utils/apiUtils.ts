
// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error wrapper for API calls
export const apiWrapper = async (apiCall: () => Promise<any>) => {
  try {
    return await apiCall();
  } catch (error) {
    // Just rethrow the error - toast handling should be in the components
    throw error;
  }
};
