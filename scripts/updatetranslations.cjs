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

// Check if the locales directory exists, if not, create it
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

// Check if the achievements directory exists, if not, create it
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
      // ignore directories
      if (fs.lstatSync(path.join(localesDir, locale)).isDirectory()) {
        return;
      }

      fs.writeFileSync(path.join(achievementsDir, locale), JSON.stringify(en, null, 2));
      fs.appendFileSync(path.join(achievementsDir, locale), '\n');
    }
  });
});

// Sync manifest locales with src/i18n/locales
console.log('Syncing manifest/_locales with src/i18n/locales...');
const enManifestPath = path.join(manifestLocalesDir, 'en', 'messages.json');

// Check if the English manifest exists
if (!fs.existsSync(enManifestPath)) {
  console.error(`English manifest file does not exist at '${enManifestPath}'`);
} else {
  const enManifest = fs.readFileSync(enManifestPath, 'utf8');

  // Get all locales from src/i18n/locales
  const localeFiles = fs.readdirSync(localesDir).filter((file) => {
    // Only include JSON files, not directories
    return !fs.lstatSync(path.join(localesDir, file)).isDirectory() && file.endsWith('.json');
  });

  localeFiles.forEach((localeFile) => {
    // Extract locale code (e.g., "en_GB.json" -> "en_GB")
    const localeCode = localeFile.replace('.json', '');
    const manifestLocalePath = path.join(manifestLocalesDir, localeCode);
    const manifestMessagesPath = path.join(manifestLocalePath, 'messages.json');

    // Check if this locale exists in manifest/_locales
    if (!fs.existsSync(manifestLocalePath)) {
      console.log(`Creating missing locale: ${localeCode}`);
      fs.mkdirSync(manifestLocalePath, { recursive: true });
      fs.writeFileSync(manifestMessagesPath, enManifest);
    }
  });

  console.log('Manifest locales sync complete!');
}
