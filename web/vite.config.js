import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const base = process.env.PUBLIC_URL || '/'
export default defineConfig({
  plugins: [react()],
  base: base.endsWith('/') ? base : base + '/',
  build: {
    outDir: 'build',
  },
})
