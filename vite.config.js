import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
      '@data':       resolve(__dirname, 'src/data'),
      '@styles':     resolve(__dirname, 'src/styles'),
      '@utils':      resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    outDir:    'dist',
    sourcemap: false,
    minify:    'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react:     ['react', 'react-dom'],
          days1to10: ['./src/data/days1to10.js'],
          days11to20:['./src/data/days11to20.js'],
          days21to30:['./src/data/days21to30.js'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true,
  },
  preview: { port: 4173 },
})
