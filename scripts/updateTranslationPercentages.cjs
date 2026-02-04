const fs = require('fs');
const path = require('path');
const https = require('https');

const CODE_MAPPINGS = {
  de: 'de_DE',
  id: 'id_ID',
  nb_NO: 'no',
  tr: 'tr_TR',
  zh_Hans: 'zh_CN',
  pt: 'pt_PT',
};

const WEBLATE_API_URL = 'https://hosted.weblate.org/api/components/mue/mue-tab-7-1/statistics/';

function fetchWeblateStats() {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mue-Translation-Update-Script',
        Accept: 'application/json',
      },
    };

    https
      .get(WEBLATE_API_URL, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function mapLanguageCode(weblateCode) {
  return CODE_MAPPINGS[weblateCode] || weblateCode;
}

async function updateTranslationPercentages() {
  try {
    console.log('Fetching translation statistics from Weblate...');
    const data = await fetchWeblateStats();

    const percentages = {};

    data.results.forEach((lang) => {
      const code = mapLanguageCode(lang.code);
      percentages[code] = {
        percent: Math.round(lang.translated_percent * 10) / 10, // Round to 1 decimal place
        lastChange: lang.last_change,
      };
    });

    const outputPath = path.join(__dirname, '../src/i18n/translationPercentages.json');
    fs.writeFileSync(outputPath, JSON.stringify(percentages, null, 2));
    fs.appendFileSync(outputPath, '\n');

    console.log(`Translation percentages updated successfully!`);
    console.log(`  Total languages: ${Object.keys(percentages).length}`);
    console.log(`  Output: ${outputPath}`);

    // Show some examples
    const sortedByPercent = Object.entries(percentages)
      .sort((a, b) => b[1].percent - a[1].percent)
      .slice(0, 5);

    console.log('\nTop 5 translated languages:');
    sortedByPercent.forEach(([code, data]) => {
      console.log(`  ${code}: ${data.percent}%`);
    });
  } catch (error) {
    console.error('Error updating translation percentages:', error);
    process.exit(1);
  }
}

updateTranslationPercentages();
