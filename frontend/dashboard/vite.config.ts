import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true // this is the fix!
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
