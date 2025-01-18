interface ApiConfig {
  BASE_URL: string;
}

const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:10000';
  }
  // Use environment variable for production URL, fallback to the IP if not set
  return import.meta.env.VITE_API_URL || 'http://161.35.137.136:10000';
};

export const API_CONFIG: ApiConfig = {
  BASE_URL: getBaseUrl()
};