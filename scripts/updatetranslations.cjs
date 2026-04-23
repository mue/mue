const fs = require('fs');
const path = require('path');
const merge = require('@eartharoid/deep-merge');

const compareAndRemoveKeys = (json1, json2) => {
  for (let key in json1) {
    if (json2.hasOwnProperty(key)) {
      if (typeof json1[key] === 'object' && typeof json2[key] === 'object') {
        compareAndRemoveKeys(json1[key], json2[key]);
      }
    } else {
      delete json1[key];
    }
  }
};

const localesDir = path.join(__dirname, '../src/i18n/locales');
const achievementsDir = path.join(localesDir, 'achievements');
const manifestLocalesDir = path.join(__dirname, '../manifest/_locales');

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

if (!fs.existsSync(achievementsDir)) {
  fs.mkdirSync(achievementsDir, { recursive: true });
}

fs.readdirSync(localesDir).forEach((file) => {
  if (file === 'en_GB.json') {
    return;
  }

  if (fs.lstatSync(path.join(localesDir, file)).isDirectory()) {
    return;
  }

  const en = require(path.join(localesDir, 'en_GB.json'));
  const newdata = merge(en, require(path.join(localesDir, file)));

  compareAndRemoveKeys(newdata, en);

  fs.writeFileSync(path.join(localesDir, file), JSON.stringify(newdata, null, 2));

  fs.appendFileSync(path.join(localesDir, file), '\n');
});

fs.readdirSync(achievementsDir).forEach((file) => {
  if (file === 'en_GB.json') {
    return;
  }

  if (fs.lstatSync(path.join(achievementsDir, file)).isDirectory()) {
    return;
  }

  const enGBFilePath = path.join(achievementsDir, 'en_GB.json');
  if (!fs.existsSync(enGBFilePath)) {
    console.error(`File 'en_GB.json' does not exist in the directory '${achievementsDir}'`);
    return;
  }

  const en = require(enGBFilePath);
  const newdata = merge(en, require(path.join(achievementsDir, file)));

  compareAndRemoveKeys(newdata, en);

  fs.writeFileSync(path.join(achievementsDir, file), JSON.stringify(newdata, null, 2));

  fs.appendFileSync(path.join(achievementsDir, file), '\n');

  const locales = fs.readdirSync(localesDir);
  locales.forEach((locale) => {
    if (!fs.existsSync(path.join(achievementsDir, locale))) {
      if (fs.lstatSync(path.join(localesDir, locale)).isDirectory()) {
        return;
      }

      fs.writeFileSync(path.join(achievementsDir, locale), JSON.stringify(en, null, 2));
      fs.appendFileSync(path.join(achievementsDir, locale), '\n');
    }
  });
});

console.log('Syncing manifest/_locales with src/i18n/locales...');
const enManifestPath = path.join(manifestLocalesDir, 'en', 'messages.json');

if (!fs.existsSync(enManifestPath)) {
  console.error(`English manifest file does not exist at '${enManifestPath}'`);
} else {
  const enManifest = fs.readFileSync(enManifestPath, 'utf8');

  const localeFiles = fs.readdirSync(localesDir).filter((file) => {
    return !fs.lstatSync(path.join(localesDir, file)).isDirectory() && file.endsWith('.json');
  });

  localeFiles.forEach((localeFile) => {
    const localeCode = localeFile.replace('.json', '');
    const manifestLocalePath = path.join(manifestLocalesDir, localeCode);
    const manifestMessagesPath = path.join(manifestLocalePath, 'messages.json');

    if (!fs.existsSync(manifestLocalePath)) {
      console.log(`Creating missing locale: ${localeCode}`);
      fs.mkdirSync(manifestLocalePath, { recursive: true });
      fs.writeFileSync(manifestMessagesPath, enManifest);
    }
  });

  console.log('Manifest locales sync complete!');
}
