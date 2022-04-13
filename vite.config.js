import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
