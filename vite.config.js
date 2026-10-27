import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

//TODO programmatically load origin instead of hardcoding

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()]
})
