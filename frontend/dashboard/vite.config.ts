import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
console.log(process.env.NODE_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true // this is the fix!
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '')
      },
      '/mapeditor': {
        target: 'http://0.0.0.0:5000/',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '')
      }
    },
  },
  base: process.env.NODE_ENV === "development" ? "/" : "/dashboard"
})
