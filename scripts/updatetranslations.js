// tl;dr this function merges the translation file with the english file in order to add untranslated strings
const fs = require('fs');
const merge = require('@eartharoid/deep-merge');

fs.readdirSync('../src/translations').forEach((file) => {
  if (file === 'en_GB.json') {
    return;
  }

  const newdata = merge(
    require('../src/translations/en_GB.json'),
    require('../src/translations/' + file),
  );

  // remove unused strings
  const en = require('../src/translations/en_GB.json');
  const keys = Object.keys(newdata);
  const enkeys = Object.keys(en);
  const unused = keys.filter((key) => !enkeys.includes(key));
  unused.forEach((key) => {
    delete newdata[key];
  });
  fs.writeFileSync('../src/translations/' + file, JSON.stringify(newdata, null, 2));

  // add new line
  fs.appendFileSync('../src/translations/' + file, '\n');
});
