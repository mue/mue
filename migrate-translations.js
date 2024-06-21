const fs = require('fs');
const YAML = require('yaml');

const compareAndRemoveKeys = (json1, json2) => {
  for (let key in json1) {
    if (json2.hasOwnProperty(key)) {
      if (typeof json1[key] === 'object' && typeof json2[key] === 'object') {
        compareAndRemoveKeys(json1[key], json2[key]);
      } else {
        if (json1[key] === json2[key]) {
          delete json1[key];
        }
      }
    } else {
      delete json1[key];
    }
  }
};

const original = JSON.parse(fs.readFileSync(`./src/i18n/locales/en-GB.json`, 'utf8'));

fs.readdirSync('./src/i18n/locales').forEach(e => {
  if (!e.endsWith('json')) return;
  const data = JSON.parse(fs.readFileSync(`./src/i18n/locales/${e}`, 'utf8'));
  const name = e.replace('.json', '');

  if (name !== 'en-GB') {
    compareAndRemoveKeys(data, original);
  }

  try {
    fs.mkdirSync(`./src/i18n/${name}`);
  } catch (e) { }

  const _addons = YAML.stringify(data.modals?.main?.addons) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/_addons.yml`, _addons);
  delete data?.modals?.main?.addons;

  const _marketplace = YAML.stringify(data.modals?.main?.marketplace) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/_marketplace.yml`, _marketplace);
  delete data?.modals?.main?.marketplace;

  const _settings = YAML.stringify(data.modals?.main?.settings) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/_settings.yml`, _settings);
  delete data?.modals?.main?.settings;

  const _welcome = YAML.stringify(data.modals?.welcome) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/_welcome.yml`, _welcome);
  delete data?.modals?.welcome;

  const main = YAML.stringify(data) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/main.yml`, main);
});


fs.readdirSync('./src/i18n/locales/achievements').forEach(e => {
  if (!e.endsWith('json')) return;
  const data = JSON.parse(fs.readFileSync(`./src/i18n/locales/achievements/${e}`, 'utf8'));
  const name = e.replace('.json', '');

  if (name !== 'en-GB') {
    compareAndRemoveKeys(data, original);
  }

  const _achievements = YAML.stringify(data) || '{}';
  fs.writeFileSync(`./src/i18n/${name}/_achievements.yml`, _achievements);
});
