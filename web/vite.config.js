import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.PUBLIC_URL || '/',
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': {
      PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL || ''),
    },
  },
})
