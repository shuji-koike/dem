interface ImportMeta {
  env: {
    MODE: "development" | "production"
    BASE_URL: string
    PROD: boolean
    DEV: boolean
    VITE_STEAM_API: string
    VITE_FIREBASE_PROJECT_ID: string
    VITE_FIREBASE_API_KEY: string
    VITE_FIREBASE_APP_ID: string
    VITE_FIREBASE_USE_EMULATOR: string
  }
}
