import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';


export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  },
  build: {
    minify: isProd,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, './src/components'),
      modules: path.resolve(__dirname, './src/modules'),
      translations: path.resolve(__dirname, './src/translations'),
      scss: path.resolve(__dirname, './src/scss')
    }
  }
});
