import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://paperstudio-env.eba-zhfvtb4v.us-east-1.elasticbeanstalk.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})