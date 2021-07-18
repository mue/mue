const fs = require('fs');
const merge = require('@eartharoid/deep-merge');

fs.readdirSync('../src/translations').forEach((file) => {
  if (file === 'en_GB.json') {
    return;
  }

  const newdata = merge(require('../src/translations/en_GB.json'), require('../src/translations/' + file));
  fs.writeFileSync('../src/translations/' + file, JSON.stringify(newdata, null, 2));
  fs.appendFileSync('../src/translations/' + file, '\n');
});
