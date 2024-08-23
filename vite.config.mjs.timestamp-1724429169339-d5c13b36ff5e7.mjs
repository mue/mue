// vite.config.mjs
import { defineConfig, loadEnv } from "file:///F:/Programming/mue/node_modules/.pnpm/vite@5.2.12_@types+node@22.5.0_sass@1.77.8/node_modules/vite/dist/node/index.js";
import inspect from "file:///F:/Programming/mue/node_modules/vite-plugin-inspect/dist/index.mjs";
import react from "file:///F:/Programming/mue/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_@swc+helpers@0.5.12_vite@5.2.12_@types+node@22.5.0_sass@1.77.8_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import progress from "file:///F:/Programming/mue/node_modules/.pnpm/vite-plugin-progress@0.0.7_vite@5.2.12_@types+node@22.5.0_sass@1.77.8_/node_modules/vite-plugin-progress/dist/index.mjs";
import I18nPlugin from "file:///F:/Programming/mue/node_modules/.pnpm/@eartharoid+vite-plugin-i18n@1.0.0-alpha.5_@types+node@22.5.0_rollup@4.21.0_sass@1.77.8/node_modules/@eartharoid/vite-plugin-i18n/dist/index.js";
import YAML from "file:///F:/Programming/mue/node_modules/yaml/dist/index.js";

// build/finalise.js
import fs from "node:fs";
import ADMZip from "file:///F:/Programming/mue/node_modules/adm-zip/adm-zip.js";

// package.json
var version = "7.1.1";

// build/finalise.js
function finalise(isProd2) {
  return {
    name: "finalise",
    writeBundle() {
      if (isProd2) {
        if (fs.existsSync("./extensions")) {
          fs.rmSync("./extensions", { recursive: true });
        }
        fs.writeFileSync(
          "./i18n-fallback.json",
          JSON.stringify(
            JSON.parse(fs.readFileSync("./dist/i18n-fallback.json", "utf8")),
            null,
            2
          )
        );
        fs.rmSync("./dist/i18n-fallback.json");
        for (const browser of ["chrome", "firefox"]) {
          fs.mkdirSync(`./extensions/${browser}`, { recursive: true });
          fs.copyFileSync(
            `./manifest/${browser}.json`,
            `./extensions/${browser}/manifest.json`
          );
          fs.copyFileSync(
            "./manifest/background.js",
            `./extensions/${browser}/background.js`
          );
          if (browser === `${browser}`) {
            fs.cpSync(
              "./manifest/_locales",
              `./extensions/${browser}/_locales`,
              {
                recursive: true
              }
            );
          }
          fs.cpSync("./dist", `./extensions/${browser}/`, {
            recursive: true
          });
          const cZip = new ADMZip();
          cZip.addLocalFolder(`./extensions/${browser}`);
          cZip.writeZip(`./extensions/${browser}-${version}.zip`);
        }
      }
    }
  };
}

// vite.config.mjs
var __vite_injected_original_dirname = "F:\\Programming\\mue";
var r = (...p) => path.resolve(__vite_injected_original_dirname, ...p);
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    plugins: [
      inspect(),
      react(),
      I18nPlugin({
        default: "en-GB",
        id_regex: /((?<locale>[a-z0-9-_]+)\/)((_(?<namespace>[a-z0-9-_]+))|[a-z0-9-_]+)\.[a-z]+/i,
        include: "./src/i18n/**/*.yml",
        parser: YAML.parse
      }),
      finalise(isProd),
      progress()
    ],
    server: {
      open: true,
      hmr: {
        protocol: "ws",
        host: "localhost"
      }
    },
    build: {
      target: ["es2022", "chrome89", "edge89", "firefox89", "safari15"],
      minify: isProd ? "esbuild" : false,
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@mui")) {
                return "vendor_mui";
              }
              return "vendor";
            }
          }
        }
      }
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "@": r("./src"),
        i18n: r("./src/i18n"),
        components: r("./src/components"),
        assets: r("./src/assets"),
        config: r("./src/config"),
        features: r("./src/features"),
        lib: r("./src/lib"),
        scss: r("./src/scss"),
        utils: r("./src/utils")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIiwgImJ1aWxkL2ZpbmFsaXNlLmpzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFByb2dyYW1taW5nXFxcXG11ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUHJvZ3JhbW1pbmdcXFxcbXVlXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovUHJvZ3JhbW1pbmcvbXVlL3ZpdGUuY29uZmlnLm1qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgaW5zcGVjdCBmcm9tICd2aXRlLXBsdWdpbi1pbnNwZWN0JztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgcHJvZ3Jlc3MgZnJvbSAndml0ZS1wbHVnaW4tcHJvZ3Jlc3MnO1xyXG5pbXBvcnQgSTE4blBsdWdpbiBmcm9tICdAZWFydGhhcm9pZC92aXRlLXBsdWdpbi1pMThuJztcclxuaW1wb3J0IFlBTUwgZnJvbSAneWFtbCc7XHJcbmltcG9ydCBmaW5hbGlzZSBmcm9tICcuL2J1aWxkL2ZpbmFsaXNlJztcclxuXHJcbmNvbnN0IHIgPSAoLi4ucCkgPT4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgLi4ucCk7XHJcbmNvbnN0IGlzUHJvZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG4gIHJldHVybiB7XHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19BUFBfRU5WX186IEpTT04uc3RyaW5naWZ5KGVudi5BUFBfRU5WKSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIGluc3BlY3QoKSxcclxuICAgICAgcmVhY3QoKSxcclxuICAgICAgSTE4blBsdWdpbih7XHJcbiAgICAgICAgZGVmYXVsdDogJ2VuLUdCJyxcclxuICAgICAgICBpZF9yZWdleDogLygoPzxsb2NhbGU+W2EtejAtOS1fXSspXFwvKSgoXyg/PG5hbWVzcGFjZT5bYS16MC05LV9dKykpfFthLXowLTktX10rKVxcLlthLXpdKy9pLFxyXG4gICAgICAgIGluY2x1ZGU6ICcuL3NyYy9pMThuLyoqLyoueW1sJyxcclxuICAgICAgICBwYXJzZXI6IFlBTUwucGFyc2UsXHJcbiAgICAgIH0pLFxyXG4gICAgICBmaW5hbGlzZShpc1Byb2QpLFxyXG4gICAgICBwcm9ncmVzcygpXHJcbiAgICBdLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIGhtcjoge1xyXG4gICAgICAgIHByb3RvY29sOiAnd3MnLFxyXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogWydlczIwMjInLCAnY2hyb21lODknLCAnZWRnZTg5JywgJ2ZpcmVmb3g4OScsICdzYWZhcmkxNSddLFxyXG4gICAgICBtaW5pZnk6IGlzUHJvZCA/ICdlc2J1aWxkJyA6IGZhbHNlLFxyXG4gICAgICBzb3VyY2VtYXA6ICFpc1Byb2QsXHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAbXVpJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yX211aSc7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy5qc3gnXSxcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHIoJy4vc3JjJyksXHJcbiAgICAgICAgaTE4bjogcignLi9zcmMvaTE4bicpLFxyXG4gICAgICAgIGNvbXBvbmVudHM6IHIoJy4vc3JjL2NvbXBvbmVudHMnKSxcclxuICAgICAgICBhc3NldHM6IHIoJy4vc3JjL2Fzc2V0cycpLFxyXG4gICAgICAgIGNvbmZpZzogcignLi9zcmMvY29uZmlnJyksXHJcbiAgICAgICAgZmVhdHVyZXM6IHIoJy4vc3JjL2ZlYXR1cmVzJyksXHJcbiAgICAgICAgbGliOiByKCcuL3NyYy9saWInKSxcclxuICAgICAgICBzY3NzOiByKCcuL3NyYy9zY3NzJyksXHJcbiAgICAgICAgdXRpbHM6IHIoJy4vc3JjL3V0aWxzJyksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXFByb2dyYW1taW5nXFxcXG11ZVxcXFxidWlsZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUHJvZ3JhbW1pbmdcXFxcbXVlXFxcXGJ1aWxkXFxcXGZpbmFsaXNlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9Qcm9ncmFtbWluZy9tdWUvYnVpbGQvZmluYWxpc2UuanNcIjtpbXBvcnQgZnMgZnJvbSBgbm9kZTpmc2A7XHJcbmltcG9ydCBBRE1aaXAgZnJvbSAnYWRtLXppcCc7XHJcbmltcG9ydCAqIGFzIHBrZyBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluYWxpc2UoaXNQcm9kKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICdmaW5hbGlzZScsXHJcbiAgICAgIHdyaXRlQnVuZGxlKCkge1xyXG4gICAgICBpZiAoaXNQcm9kKSB7XHJcbiAgICAgICAgLy8gY2xlYW4gdXBcclxuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYygnLi9leHRlbnNpb25zJykpIHtcclxuICAgICAgICAgIGZzLnJtU3luYygnLi9leHRlbnNpb25zJywgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwcmV0dGlmeSBhbmQgbW92ZSBpMThuIHJlcG9ydFxyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgICAgICAnLi9pMThuLWZhbGxiYWNrLmpzb24nLFxyXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgICAgIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL2Rpc3QvaTE4bi1mYWxsYmFjay5qc29uJywgJ3V0ZjgnKSksXHJcbiAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgZnMucm1TeW5jKCcuL2Rpc3QvaTE4bi1mYWxsYmFjay5qc29uJyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgYnJvd3NlciBvZiBbJ2Nocm9tZScsICdmaXJlZm94J10pIHtcclxuICAgICAgICAgIC8vIHNldCB1cFxyXG4gICAgICAgICAgZnMubWtkaXJTeW5jKGAuL2V4dGVuc2lvbnMvJHticm93c2VyfWAsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgLy8gY29weSBtYW5pZmVzdFxyXG4gICAgICAgICAgZnMuY29weUZpbGVTeW5jKFxyXG4gICAgICAgICAgICBgLi9tYW5pZmVzdC8ke2Jyb3dzZXJ9Lmpzb25gLFxyXG4gICAgICAgICAgICBgLi9leHRlbnNpb25zLyR7YnJvd3Nlcn0vbWFuaWZlc3QuanNvbmAsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgLy8gY29weSBzZXJ2aWNlIHdvcmtlclxyXG4gICAgICAgICAgZnMuY29weUZpbGVTeW5jKFxyXG4gICAgICAgICAgICAnLi9tYW5pZmVzdC9iYWNrZ3JvdW5kLmpzJyxcclxuICAgICAgICAgICAgYC4vZXh0ZW5zaW9ucy8ke2Jyb3dzZXJ9L2JhY2tncm91bmQuanNgLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIC8vIGNocm9tZSBpcyB3ZWlyZFxyXG4gICAgICAgICAgaWYgKGJyb3dzZXIgPT09IGAke2Jyb3dzZXJ9YCkge1xyXG4gICAgICAgICAgICBmcy5jcFN5bmMoXHJcbiAgICAgICAgICAgICAgJy4vbWFuaWZlc3QvX2xvY2FsZXMnLFxyXG4gICAgICAgICAgICAgIGAuL2V4dGVuc2lvbnMvJHticm93c2VyfS9fbG9jYWxlc2AsXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBjb3B5IGJ1aWxkXHJcbiAgICAgICAgICBmcy5jcFN5bmMoJy4vZGlzdCcsIGAuL2V4dGVuc2lvbnMvJHticm93c2VyfS9gLCB7XHJcbiAgICAgICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLy8gcGFja2FnZVxyXG4gICAgICAgICAgY29uc3QgY1ppcCA9IG5ldyBBRE1aaXAoKTtcclxuICAgICAgICAgIGNaaXAuYWRkTG9jYWxGb2xkZXIoYC4vZXh0ZW5zaW9ucy8ke2Jyb3dzZXJ9YCk7XHJcbiAgICAgICAgICBjWmlwLndyaXRlWmlwKGAuL2V4dGVuc2lvbnMvJHticm93c2VyfS0ke3BrZy52ZXJzaW9ufS56aXBgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfVxyXG59XHJcbiIsICJ7XHJcbiAgXCJuYW1lXCI6IFwibXVlXCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJhdXRob3JcIjogXCJUaGUgTXVlIEF1dGhvcnMgKGh0dHBzOi8vZ2l0aHViLmNvbS9tdWUvbXVlL2dyYXBocy9jb250cmlidXRvcnMpXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkZhc3QsIG9wZW4gYW5kIGZyZWUtdG8tdXNlIG5ldyB0YWIgcGFnZSBmb3IgbW9kZXJuIGJyb3dzZXJzLlwiLFxyXG4gIFwicmVwb3NpdG9yeVwiOiB7XHJcbiAgICBcInVybFwiOiBcImdpdGh1YjptdWUvbXVlXCJcclxuICB9LFxyXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL211ZXRhYi5jb21cIixcclxuICBcImJ1Z3NcIjogXCJodHRwczovL2dpdGh1Yi5jb20vbXVlL211ZS9pc3N1ZXMvbmV3P2Fzc2lnbmVlcz0mbGFiZWxzPWJ1ZyZ0ZW1wbGF0ZT1idWctcmVwb3J0Lm1kJnRpdGxlPSU1QkJVRyU1RFwiLFxyXG4gIFwibGljZW5zZVwiOiBcIkJTRC0zLUNsYXVzZVwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjcuMS4xXCIsXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAZWFydGhhcm9pZC9pMThuXCI6IFwiMi4wLjAtYWxwaGEuMVwiLFxyXG4gICAgXCJAZWFydGhhcm9pZC92aXRlLXBsdWdpbi1pMThuXCI6IFwiXjEuMC4wLWFscGhhLjVcIixcclxuICAgIFwiQGVtb3Rpb24vcmVhY3RcIjogXCJeMTEuMTEuNFwiLFxyXG4gICAgXCJAZW1vdGlvbi9zdHlsZWRcIjogXCJeMTEuMTEuNVwiLFxyXG4gICAgXCJAZmxvYXRpbmctdWkvcmVhY3QtZG9tXCI6IFwiMi4xLjBcIixcclxuICAgIFwiQGZvbnRzb3VyY2UtdmFyaWFibGUvbGV4ZW5kLWRlY2FcIjogXCJeNS4wLjEzXCIsXHJcbiAgICBcIkBmb250c291cmNlLXZhcmlhYmxlL21vbnRzZXJyYXRcIjogXCJeNS4wLjE5XCIsXHJcbiAgICBcIkBoZWFkbGVzc3VpL3JlYWN0XCI6IFwiXjIuMS4wXCIsXHJcbiAgICBcIkBtdWV0YWIvcmVhY3Qtc29ydGFibGUtaG9jXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcIkBtdWkvbWF0ZXJpYWxcIjogXCI1LjE1LjE5XCIsXHJcbiAgICBcIkBzZW50cnkvcmVhY3RcIjogXCJeOC4xMS4wXCIsXHJcbiAgICBcImNsc3hcIjogXCJeMi4xLjFcIixcclxuICAgIFwiZW1ibGEtY2Fyb3VzZWwtYXV0b3BsYXlcIjogXCI4LjEuM1wiLFxyXG4gICAgXCJlbWJsYS1jYXJvdXNlbC1yZWFjdFwiOiBcIjguMS4zXCIsXHJcbiAgICBcImZhc3QtYmx1cmhhc2hcIjogXCJeMS4xLjJcIixcclxuICAgIFwiZnJhbWVyLW1vdGlvblwiOiBcIl4xMS4yLjExXCIsXHJcbiAgICBcImltYWdlLWNvbnZlcnNpb25cIjogXCJeMi4xLjFcIixcclxuICAgIFwibWFya2Rvd24tdG8tanN4XCI6IFwiXjcuNC43XCIsXHJcbiAgICBcInJlYWN0XCI6IFwiXjE4LjMuMVwiLFxyXG4gICAgXCJyZWFjdC1iZXN0LWdyYWRpZW50LWNvbG9yLXBpY2tlclwiOiBcIl4zLjAuOFwiLFxyXG4gICAgXCJyZWFjdC1jbG9ja1wiOiBcIjUuMC4wXCIsXHJcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcclxuICAgIFwicmVhY3QtaWNvbnNcIjogXCJeNS4yLjFcIixcclxuICAgIFwicmVhY3QtbW9kYWxcIjogXCIzLjE2LjFcIixcclxuICAgIFwicmVhY3QtdG9hc3RpZnlcIjogXCIxMC4wLjVcIixcclxuICAgIFwidXNlLWRlYm91bmNlXCI6IFwiXjEwLjAuMVwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1pbnNwZWN0XCI6IFwiXjAuOC40XCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGNvbW1pdGxpbnQvY2xpXCI6IFwiXjE5LjMuMFwiLFxyXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE5LjIuMlwiLFxyXG4gICAgXCJAZWFydGhhcm9pZC9kZWVwLW1lcmdlXCI6IFwiXjAuMC4yXCIsXHJcbiAgICBcIkB0YWlsd2luZGNzcy90eXBvZ3JhcGh5XCI6IFwiXjAuNS4xM1wiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCJeMy43LjBcIixcclxuICAgIFwiYWRtLXppcFwiOiBcIl4wLjUuMTRcIixcclxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTlcIixcclxuICAgIFwiZXNsaW50XCI6IFwiXjguNTcuMFwiLFxyXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMS4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcmVhY3QtYXBwXCI6IFwiXjcuMC4xXCIsXHJcbiAgICBcImh1c2t5XCI6IFwiXjkuMC4xMVwiLFxyXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjMuMlwiLFxyXG4gICAgXCJzYXNzXCI6IFwiXjEuNzcuNlwiLFxyXG4gICAgXCJzdHlsZWxpbnRcIjogXCJeMTYuNi4xXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmQtc2Nzc1wiOiBcIl4xMy4xLjBcIixcclxuICAgIFwic3R5bGVsaW50LXNjc3NcIjogXCJeNi4zLjJcIixcclxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy40LjRcIixcclxuICAgIFwidml0ZVwiOiBcIjUuMi4xMlwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1wcm9ncmVzc1wiOiBcIl4wLjAuN1wiLFxyXG4gICAgXCJ5YW1sXCI6IFwiXjIuNC41XCJcclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiZGV2Omhvc3RcIjogXCJ2aXRlIC0taG9zdFwiLFxyXG4gICAgXCJidWlsZFwiOiBcInZpdGUgYnVpbGRcIixcclxuICAgIFwicHJldHR5XCI6IFwicHJldHRpZXIgLS13cml0ZSBcXFwiLi8qKi8qLntqcyxqc3gsanNvbixzY3NzLGNzc31cXFwiXCIsXHJcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgXFxcIi4vc3JjLyoqLyoue2pzLGpzeH1cXFwiICYmIHN0eWxlbGludCBcXFwiLi9zcmMvKiovKi57c2Nzcyxjc3N9XFxcIlwiLFxyXG4gICAgXCJsaW50OmZpeFwiOiBcImVzbGludCBcXFwiLi9zcmMvKiovKi57anMsanN4fVxcXCIgLS1maXggJiYgc3R5bGVsaW50IFxcXCIuL3NyYy8qKi8qLntzY3NzLGNzc31cXFwiIC0tZml4XCIsXHJcbiAgICBcInBvc3RpbnN0YWxsXCI6IFwiaHVza3lcIlxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdQLFNBQVMsY0FBYyxlQUFlO0FBQ3RSLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sY0FBYztBQUNyQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFVBQVU7OztBQ04yTyxPQUFPLFFBQVE7QUFDM1EsT0FBTyxZQUFZOzs7QUNVakIsY0FBVzs7O0FEUEUsU0FBUixTQUEwQkEsU0FBUTtBQUN2QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDSixjQUFjO0FBQ2QsVUFBSUEsU0FBUTtBQUVWLFlBQUksR0FBRyxXQUFXLGNBQWMsR0FBRztBQUNqQyxhQUFHLE9BQU8sZ0JBQWdCLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBQSxRQUMvQztBQUdBLFdBQUc7QUFBQSxVQUNEO0FBQUEsVUFDQSxLQUFLO0FBQUEsWUFDSCxLQUFLLE1BQU0s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
