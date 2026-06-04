// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from 'E:/Karvocab/RIPT1307-Nhom-10-KTHP/frontend/client/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('@/pages/public/Landingpage/LandingPage').default,
    "exact": true
  },
  {
    "path": "/home-page",
    "component": require('@/pages/main/home/home-page').default,
    "wrappers": [require('@/wrappers/AuthWrapper').default],
    "exact": true
  },
  {
    "path": "/user",
    "component": require('@/layouts/UserLayout').default,
    "wrappers": [require('@/wrappers/AuthWrapper').default],
    "routes": [
      {
        "path": "/user",
        "component": require('@/pages/user/DashboardPage').default,
        "exact": true
      },
      {
        "path": "/user/profile",
        "component": require('@/pages/user/profile').default,
        "exact": true
      },
      {
        "path": "/user/change-password",
        "component": require('@/pages/user/ChangePasswordPage').default,
        "exact": true
      }
    ]
  },
  {
    "path": "/auth/login",
    "component": require('@/pages/auth/LoginPage').default,
    "exact": true
  },
  {
    "path": "/*",
    "component": require('@/pages/main/not-found-page').default,
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
