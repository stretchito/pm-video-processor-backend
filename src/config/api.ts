interface ApiConfig {
  BASE_URL: string;
}

const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:10000';
  }
  // Use environment variable for production URL, fallback to the IP if not set
  return process.env.VITE_API_URL || 'http://161.35.137.136:10000';
};

export const API_CONFIG: ApiConfig = {
  BASE_URL: getBaseUrl()
};