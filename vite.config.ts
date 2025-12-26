import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    server: {
        proxy: {
            '/gamma': {
                target: 'https://gamma-api.polymarket.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/gamma/, ''),
            },
            '/clob': {
                target: 'https://clob.polymarket.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/clob/, ''),
            },
        },
    },
})
