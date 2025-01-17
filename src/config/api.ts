const API_CONFIG = {
  // Default to production backend unless explicitly set to use local
  BASE_URL: import.meta.env.VITE_USE_LOCAL_BACKEND === 'true'
    ? 'http://localhost:10000'        // Local development backend
    : 'https://161.35.137.136:10000'   // Production backend (now using HTTPS)
} as const;

export { API_CONFIG };