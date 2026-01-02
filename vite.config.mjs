import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import ADMZip from 'adm-zip';
import * as pkg from './package.json';
import progress from 'vite-plugin-progress';

const isProd = process.env.NODE_ENV === 'production';

const prepareBuilds = () => ({
  name: 'prepareBuilds',
  buildEnd() {
    if (isProd) {
      // make directories if not exist
      fs.mkdirSync(path.resolve(__dirname, './build'), { recursive: true });
      fs.mkdirSync(path.resolve(__dirname, './dist'), { recursive: true });

      // chrome
      fs.mkdirSync(path.resolve(__dirname, './build/chrome'), { recursive: true });
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/chrome.json'),
        path.resolve(__dirname, './build/chrome/manifest.json'),
      );
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(__dirname, './build/chrome/background.js'),
      );
      fs.cpSync(
        path.resolve(__dirname, './manifest/_locales'),
        path.resolve(__dirname, './build/chrome/_locales'),
        { recursive: true },
      );
      fs.cpSync(path.resolve(__dirname, './dist'), path.resolve(__dirname, './build/chrome/'), {
        recursive: true,
      });
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(__dirname, './build/chrome/icons'),
        { recursive: true },
      );
      fs.mkdirSync(path.resolve(__dirname, './build/chrome/src/assets'), { recursive: true });
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(__dirname, './build/chrome/src/assets'),
        { recursive: true },
      );

      // firefox
      fs.mkdirSync(path.resolve(__dirname, './build/firefox'), { recursive: true });
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/firefox.json'),
        path.resolve(__dirname, './build/firefox/manifest.json'),
      );
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(__dirname, './build/firefox/background.js'),
      );
      fs.cpSync(path.resolve(__dirname, './dist'), path.resolve(__dirname, './build/firefox/'), {
        recursive: true,
      });
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(__dirname, './build/firefox/icons'),
        { recursive: true },
      );
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(__dirname, './build/firefox/src/assets'),
        { recursive: true },
      );

      // safari
      const safariResourcesPath = path.resolve(__dirname, './safari/Mue Extension/Resources');
      fs.mkdirSync(safariResourcesPath, { recursive: true });
      
      // Copy manifest (already exists in Resources, but ensure it's updated)
      // The manifest.json is managed separately for Safari
      
      // Copy background.js
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(safariResourcesPath, 'background.js'),
      );
      
      // Copy built files from dist
      fs.cpSync(path.resolve(__dirname, './dist'), safariResourcesPath, {
        recursive: true,
        filter: (src) => {
          // Don't overwrite the manifest.json we've already set up
          return !src.endsWith('manifest.json');
        },
      });
      
      // Copy icons
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(safariResourcesPath, 'icons'),
        { recursive: true },
      );
      
      // Copy src/assets
      fs.mkdirSync(path.resolve(safariResourcesPath, 'src/assets'), { recursive: true });
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(safariResourcesPath, 'src/assets'),
        { recursive: true },
      );
      
      // Copy locales
      fs.cpSync(
        path.resolve(__dirname, './manifest/_locales'),
        path.resolve(safariResourcesPath, '_locales'),
        { recursive: true },
      );

      // create zip
      const zip = new ADMZip();
      zip.addLocalFolder(path.resolve(__dirname, './build/chrome'));
      zip.writeZip(path.resolve(__dirname, `./build/chrome-${pkg.version}.zip`));

      const zip2 = new ADMZip();
      zip2.addLocalFolder(path.resolve(__dirname, './build/firefox'));
      zip2.writeZip(path.resolve(__dirname, `./build/firefox-${pkg.version}.zip`));

      //todo: fix this
      // temp copy src for /dist too
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(__dirname, './dist/src/assets'),
        { recursive: true },
      );
    }
  },
});

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: { __APP_ENV__: JSON.stringify(env.APP_ENV) },
    plugins: [react(), prepareBuilds(), progress()],
    server: { open: true, hmr: { protocol: 'ws', host: 'localhost' } },
    build: {
      target: 'esnext', // Use modern JavaScript features
      minify: isProd ? 'esbuild' : false,
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks: undefined, // Let Vite handle chunking automatically to avoid circular dependency issues
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        i18n: path.resolve(__dirname, './src/i18n'),
        components: path.resolve(__dirname, './src/components'),
        assets: path.resolve(__dirname, './src/assets'),
        config: path.resolve(__dirname, './src/config'),
        features: path.resolve(__dirname, './src/features'),
        lib: path.resolve(__dirname, './src/lib'),
        scss: path.resolve(__dirname, './src/scss'),
        translations: path.resolve(__dirname, './src/i18n/locales'),
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  };
});
