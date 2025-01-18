/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_LOCAL_BACKEND: string
  readonly VITE_API_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}