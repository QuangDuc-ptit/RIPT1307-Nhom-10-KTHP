/**
 * Tập trung mọi biến môi trường vào một chỗ.
 * KHÔNG dùng `import.meta.env.XXX` rải rác trong code — gọi qua object `env` này
 * để dễ refactor và type-safe.
 */
export const env = {
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  appName: process.env.VITE_APP_NAME || 'Base Web',
  tokenKey: process.env.VITE_TOKEN_KEY || 'base_web_client_token',
  refreshTokenKey:
    process.env.VITE_REFRESH_TOKEN_KEY || 'base_web_client_refresh_token',
} as const;
