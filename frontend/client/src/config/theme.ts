import type { ThemeConfig } from 'antd';

/**
 * Antd 5 theme tokens. Sửa primary color hoặc spacing tại đây để áp dụng toàn app.
 * Xem: https://ant.design/docs/react/customize-theme
 */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f5f7fa',
    },
    Button: {
      controlHeight: 38,
    },
  },
};
