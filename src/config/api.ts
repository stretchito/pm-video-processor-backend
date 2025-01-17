const API_CONFIG = {
  // Default to production backend unless explicitly set to use local
  BASE_URL: import.meta.env.VITE_USE_LOCAL_BACKEND === 'false'
    ? 'http://localhost:10000'        // Local development backend
    : 'http://161.35.137.136:10000'   // Production backend
} as const;

export { API_CONFIG };