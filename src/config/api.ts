interface ApiConfig {
  BASE_URL: string;
}

export const API_CONFIG: ApiConfig = {
  BASE_URL: import.meta.env.VITE_USE_LOCAL_BACKEND === 'true'
    ? 'http://localhost:10000'
    : 'http://161.35.137.136:10000'
};