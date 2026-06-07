import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntdApp } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import viVN from 'antd/locale/vi_VN';
import 'dayjs/locale/vi';

// Import App chính - nơi chứa BrowserRouter và Routes
import App from './App'; 

// Import các cấu hình chung
import { antdTheme } from './config/theme'; 
import './assets/styles/global.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Cung cấp theme và locale cho Ant Design */}
      <ConfigProvider locale={viVN} theme={antdTheme}>
        {/* AntdApp giúp sử dụng các hook như message, notification, modal của antd mà không cần wrap từng cái */}
        <AntdApp>
          <App /> 
        </AntdApp>
      </ConfigProvider>
    </HelmetProvider>
  </React.StrictMode>
);