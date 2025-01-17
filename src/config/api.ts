interface ApiConfig {
  BASE_URL: string;
}

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.VITE_USE_LOCAL_BACKEND === 'true') {
    return 'http://localhost:10000';
  }
  return 'http://161.35.137.136:10000';
};

export const API_CONFIG: ApiConfig = {
  BASE_URL: getBaseUrl()
};