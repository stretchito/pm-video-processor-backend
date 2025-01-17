/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_LOCAL_BACKEND: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}