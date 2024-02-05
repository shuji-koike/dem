interface ImportMeta {
  env: {
    MODE: "development" | "production"
    BASE_URL: string
    PROD: boolean
    DEV: boolean
    VITE_FIREBASE_PROJECT_ID: string
    VITE_FIREBASE_API_KEY: string
    VITE_FIREBASE_APP_ID: string
    VITE_FIREBASE_USE_EMULATOR: string
    VITE_FIREBASE_MEASUREMENT_ID?: string
    VITE_SENTRY_DSN?: string
  }
}
