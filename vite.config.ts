import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    },
  },
  define: {
    // Some libs expect process.env to exist
    'process.env': {},
  },
  optimizeDeps: {
    include: ['mapbox-gl', '@mapbox/mapbox-gl-geocoder'],
  },
  server: {
    port: 5173,
    host: true,
  },
})

