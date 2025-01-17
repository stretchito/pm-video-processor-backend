interface ImportMetaEnv {
  VITE_USE_LOCAL_BACKEND?: string;
}

const useLocalBackend = (import.meta.env as ImportMetaEnv).VITE_USE_LOCAL_BACKEND === 'true';

export const API_CONFIG = {
  BASE_URL: useLocalBackend 
    ? 'http://localhost:10000'
    : 'https://161.35.137.136:10000'
};