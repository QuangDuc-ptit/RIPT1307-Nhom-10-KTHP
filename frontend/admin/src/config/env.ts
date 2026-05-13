export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Base Web Admin',
  tokenKey: import.meta.env.VITE_TOKEN_KEY || 'base_web_admin_token',
  refreshTokenKey:
    import.meta.env.VITE_REFRESH_TOKEN_KEY || 'base_web_admin_refresh_token',
} as const;
