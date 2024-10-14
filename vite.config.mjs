import { defineConfig, loadEnv } from 'vite';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import progress from 'vite-plugin-progress';
import I18nPlugin from '@eartharoid/vite-plugin-i18n';
import YAML from 'yaml';
import finalise from './build/finalise';

const r = (...p) => path.resolve(__dirname, ...p);
const isProd = process.env.NODE_ENV === 'production';


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
        default: 'en-GB',
        id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
        include: './src/i18n/**/*.yml',
        parser: YAML.parse,
      }),
      finalise(isProd),
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
      target: ['es2022', 'chrome89', 'edge89', 'firefox89', 'safari15'],
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
        '@': r('./src'),
        i18n: r('./src/i18n'),
        components: r('./src/components'),
        assets: r('./src/assets'),
        config: r('./src/config'),
        features: r('./src/features'),
        lib: r('./src/lib'),
        scss: r('./src/scss'),
        utils: r('./src/utils'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});
