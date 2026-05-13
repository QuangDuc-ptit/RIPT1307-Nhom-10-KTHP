/**
 * Tập trung mọi biến môi trường vào một chỗ.
 * KHÔNG dùng `import.meta.env.XXX` rải rác trong code — gọi qua object `env` này
 * để dễ refactor và type-safe.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Base Web',
  tokenKey: import.meta.env.VITE_TOKEN_KEY || 'base_web_client_token',
  refreshTokenKey:
    import.meta.env.VITE_REFRESH_TOKEN_KEY || 'base_web_client_refresh_token',
} as const;
