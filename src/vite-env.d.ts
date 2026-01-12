/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_L2_API_BASE_URL: string
  readonly VITE_L2_API_CUSTOMER: string
  readonly VITE_L2_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

