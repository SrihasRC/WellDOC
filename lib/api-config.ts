// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    PREDICT: '/predict',
    MODEL_INFO: '/model/info',
    HEALTH: '/health'
  }
}

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

export const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production'
