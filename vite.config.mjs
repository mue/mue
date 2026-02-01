/**
 * Vite Configuration for Mue Browser Extension
 *
 * This configuration handles building the extension for multiple browsers:
 * - Chrome/Edge (Manifest V3)
 * - Firefox (Manifest V3)
 * - Safari (via Xcode project)
 *
 * Build Process:
 * 1. Vite bundles the React app into /dist
 * 2. Assets are copied to dist/src/assets for proper path resolution
 * 3. Browser-specific builds are created in /build/{browser}
 * 4. Distribution .zip files are generated for Chrome and Firefox
 *
 * Build Commands:
 * - `bun run build` - Production build for all browsers
 * - `bun run dev` - Development server with HMR
 */
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
  closeBundle() {
    if (isProd) {
      console.log('📦 Building extension packages...');

      // Ensure base directories exist
      fs.mkdirSync(path.resolve(__dirname, './build'), { recursive: true });
      fs.mkdirSync(path.resolve(__dirname, './dist'), { recursive: true });

      // Copy assets to dist for proper bundling
      const distAssetsPath = path.resolve(__dirname, './dist/src/assets');
      fs.mkdirSync(distAssetsPath, { recursive: true });
      fs.cpSync(path.resolve(__dirname, './src/assets'), distAssetsPath, { recursive: true });

      // Chrome Build
      console.log('🔨 Building Chrome extension...');
      const chromeBuildPath = path.resolve(__dirname, './build/chrome');
      fs.mkdirSync(chromeBuildPath, { recursive: true });

      // Copy manifest and background script
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/chrome.json'),
        path.resolve(chromeBuildPath, 'manifest.json'),
      );
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(chromeBuildPath, 'background.js'),
      );

      // Copy locales
      fs.cpSync(
        path.resolve(__dirname, './manifest/_locales'),
        path.resolve(chromeBuildPath, '_locales'),
        { recursive: true },
      );

      // Copy dist (bundled app)
      fs.cpSync(path.resolve(__dirname, './dist'), chromeBuildPath, { recursive: true });

      // Copy extension icons (separate from bundled assets)
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(chromeBuildPath, 'icons'),
        { recursive: true },
      );

      // Firefox Build
      console.log('🦊 Building Firefox extension...');
      const firefoxBuildPath = path.resolve(__dirname, './build/firefox');
      fs.mkdirSync(firefoxBuildPath, { recursive: true });

      // Copy manifest and background script
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/firefox.json'),
        path.resolve(firefoxBuildPath, 'manifest.json'),
      );
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(firefoxBuildPath, 'background.js'),
      );

      // Copy dist (bundled app)
      fs.cpSync(path.resolve(__dirname, './dist'), firefoxBuildPath, { recursive: true });

      // Copy extension icons (separate from bundled assets)
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(firefoxBuildPath, 'icons'),
        { recursive: true },
      );

      // Safari Build
      console.log('🧭 Building Safari extension...');
      const safariResourcesPath = path.resolve(__dirname, './safari/Mue Extension/Resources');
      fs.mkdirSync(safariResourcesPath, { recursive: true });

      // Copy background script
      fs.copyFileSync(
        path.resolve(__dirname, './manifest/background.js'),
        path.resolve(safariResourcesPath, 'background.js'),
      );

      // Copy built files from dist (excluding manifest.json which Safari manages separately)
      fs.cpSync(path.resolve(__dirname, './dist'), safariResourcesPath, {
        recursive: true,
        filter: (src) => !src.endsWith('manifest.json'),
      });

      // Copy extension icons
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(safariResourcesPath, 'icons'),
        { recursive: true },
      );

      // Copy locales
      fs.cpSync(
        path.resolve(__dirname, './manifest/_locales'),
        path.resolve(safariResourcesPath, '_locales'),
        { recursive: true },
      );

      // Create distribution zips
      console.log('📦 Creating distribution packages...');
      const chromeZip = new ADMZip();
      chromeZip.addLocalFolder(chromeBuildPath);
      chromeZip.writeZip(path.resolve(__dirname, `./build/chrome-${pkg.version}.zip`));
      console.log(`✅ Chrome: chrome-${pkg.version}.zip`);

      const firefoxZip = new ADMZip();
      firefoxZip.addLocalFolder(firefoxBuildPath);
      firefoxZip.writeZip(path.resolve(__dirname, `./build/firefox-${pkg.version}.zip`));
      console.log(`✅ Firefox: firefox-${pkg.version}.zip`);

      console.log('✨ Build complete!');
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
        contexts: path.resolve(__dirname, './src/contexts'),
        hooks: path.resolve(__dirname, './src/hooks'),
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
