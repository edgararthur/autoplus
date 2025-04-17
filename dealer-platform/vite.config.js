import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from project root
  process.env = { ...process.env, ...loadEnv(mode, path.resolve(__dirname, '..'), '') };
  
  return {
    plugins: [react()],
    server: {
      port: 3002, // Different port for dealer platform
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'autoplus-shared': path.resolve(__dirname, '../shared')
      },
    },
  };
}); 