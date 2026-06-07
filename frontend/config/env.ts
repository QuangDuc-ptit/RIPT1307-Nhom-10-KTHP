// src/config/env.ts
/**
 * Tập trung biến môi trường.
 * Dùng chung cho cả admin và client.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Base Web',
  // Dùng chung key token cho cả admin và client (cùng backend)
  tokenKey: import.meta.env.VITE_TOKEN_KEY || 'base_web_token',
  refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'base_web_refresh_token',
} as const;