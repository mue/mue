// tl;dr this function merges the translation file with the english file in order to add untranslated strings
const fs = require('fs');
const merge = require('@eartharoid/deep-merge');

/**
 * It recursively compares the keys of two JSON objects and removes the keys from the first object that
 * are not present in the second object
 * @param json1 - The JSON object that you want to remove keys from.
 * @param json2 - The JSON object that you want to compare against.
 */
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

fs.readdirSync('../src/translations').forEach((file) => {
  if (file === 'en_GB.json') {
    return;
  }

  const en = require('../src/translations/en_GB.json');
  const newdata = merge(en, require('../src/translations/' + file));

  // remove strings not in english file
  compareAndRemoveKeys(newdata, en);

  // write new file
  fs.writeFileSync('../src/translations/' + file, JSON.stringify(newdata, null, 2));

  // add new line
  fs.appendFileSync('../src/translations/' + file, '\n');
});
