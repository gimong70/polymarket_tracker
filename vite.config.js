import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // Vercel deployment is at root, GitHub Pages is at /polymarket_tracker/
    base: process.env.VERCEL ? '/' : '/polymarket_tracker/',
    plugins: [react()],
    server: {
      proxy: {
        '/gamma': {
          target: 'https://gamma-api.polymarket.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gamma/, '')
        }
      }
    }
  }
})
