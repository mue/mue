import fs from `node:fs`;
import ADMZip from 'adm-zip';
import * as pkg from '../package.json';

export default function finalise(isProd) {
  return {
    name: 'finalise',
      writeBundle() {
      if (isProd) {
        // clean up
        if (fs.existsSync('./extensions')) {
          fs.rmSync('./extensions', { recursive: true });
        }

        // prettify and move i18n report
        fs.writeFileSync(
          './i18n-fallback.json',
          JSON.stringify(
            JSON.parse(fs.readFileSync('./dist/i18n-fallback.json', 'utf8')),
            null,
            2,
          ),
        );
        fs.rmSync('./dist/i18n-fallback.json');

        for (const browser of ['chrome', 'firefox']) {
          // set up
          fs.mkdirSync(`./extensions/${browser}`, { recursive: true });
          // copy manifest
          fs.copyFileSync(
            `./manifest/${browser}.json`,
            `./extensions/${browser}/manifest.json`,
          );
          // copy service worker
          fs.copyFileSync(
            './manifest/background.js',
            `./extensions/${browser}/background.js`,
          );
          // chrome is weird
          if (browser === `${browser}`) {
            fs.cpSync(
              './manifest/_locales',
              `./extensions/${browser}/_locales`,
              {
                recursive: true,
              },
            );
          }
          // copy build
          fs.cpSync('./dist', `./extensions/${browser}/`, {
            recursive: true,
          });
          // package
          const cZip = new ADMZip();
          cZip.addLocalFolder(`./extensions/${browser}`);
          cZip.writeZip(`./extensions/${browser}-${pkg.version}.zip`);
        }
      }
    },
  }
}
