export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? 'http://161.35.137.136:10000'  // Production backend
    : 'http://localhost:10000'        // Local development
};