import { defineConfig, loadEnv } from 'vite';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';
import ADMZip from 'adm-zip';
import * as pkg from './package.json';
import progress from 'vite-plugin-progress';
import { I18nPlugin } from '@eartharoid/vite-plugin-i18n';
import YAML from 'yaml';

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
        {
          recursive: true,
        },
      );
      fs.cpSync(path.resolve(__dirname, './dist'), path.resolve(__dirname, './build/chrome/'), {
        recursive: true,
      });
      fs.cpSync(
        path.resolve(__dirname, './src/assets/icons'),
        path.resolve(__dirname, './build/chrome/icons'),
        {
          recursive: true,
        },
      );
      fs.mkdirSync(path.resolve(__dirname, './build/chrome/src/assets'), { recursive: true });
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(__dirname, './build/chrome/src/assets'),
        {
          recursive: true,
        },
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
        {
          recursive: true,
        },
      );
      fs.cpSync(
        path.resolve(__dirname, './src/assets'),
        path.resolve(__dirname, './build/firefox/src/assets'),
        {
          recursive: true,
        },
      );

      // create zip
      const zip = new ADMZip();
      zip.addLocalFolder(path.resolve(__dirname, './build/chrome'));
      zip.writeZip(path.resolve(__dirname, `./build/chrome-${pkg.version}.zip`));

      const zip2 = new ADMZip();
      zip2.addLocalFolder(path.resolve(__dirname, './build/firefox'));
      zip2.writeZip(path.resolve(__dirname, `./build/firefox-${pkg.version}.zip`));
    }
  },
});

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [
      inspect(),
      react(),
      I18nPlugin({
        id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
        include: './src/i18n/**/*.yml',
        parser: YAML.parse,
      }),
      prepareBuilds(),
      progress()
    ],
    server: {
      open: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },
    build: {
      minify: isProd ? 'esbuild' : false,
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@mui')) {
                return 'vendor_mui';
              }

              return 'vendor';
            }
          },
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
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
  };
});
