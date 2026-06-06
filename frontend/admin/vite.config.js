import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 5174,
            open: true,
            proxy: env.VITE_PROXY_API
                ? {
                    '/api': {
                        target: env.VITE_PROXY_API,
                        changeOrigin: true,
                    },
                }
                : undefined,
        },
        build: {
            outDir: 'dist',
            sourcemap: false,
            chunkSizeWarningLimit: 1200,
        },
    };
});
