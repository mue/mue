/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const LOCALE_FILE = path.join(__dirname, '../src/i18n/locales/en_GB.json');
const ACHIEVEMENTS_FILE = path.join(__dirname, '../src/i18n/locales/achievements/en_GB.json');
const SEARCH_DIR = path.join(__dirname, '../src');
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json'];

/**
 * Flatten nested JSON object into dot-notation keys
 * @param {Object} obj - The object to flatten
 * @param {String} prefix - The prefix for nested keys
 * @returns {Array} Array of flattened keys
 */
function flattenKeys(obj, prefix = '') {
  const keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...flattenKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}


function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Search files for usage of a translation key
 * Handles both direct usage and dynamic template literal construction
 * @param {String} key - The translation key to search for
 * @param {Array} files - Array of file paths to search
 * @param {Map} fileContentsCache - Cache of file contents
 * @returns {Boolean} True if the key is found in any file
 */
function isKeyUsed(key, files, fileContentsCache) {
  const keySegments = key.split('.');
  const patterns = [];

  const escapedFullKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  patterns.push(new RegExp(`['"\`]${escapedFullKey}['"\`]`, 'g'));

  if (keySegments.length >= 2) {
    const lastTwo = keySegments.slice(-2).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\.');
    patterns.push(new RegExp(`['"\`]${lastTwo}['"\`]`, 'g'));
  }

  if (keySegments.length >= 3) {
    const lastThree = keySegments.slice(-3).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\.');
    patterns.push(new RegExp(`['"\`]${lastThree}['"\`]`, 'g'));
  }

  if (keySegments.length >= 3) {
    const finalSegment = keySegments[keySegments.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    patterns.push(new RegExp(`\\.${finalSegment}['"\`]`, 'g'));
  }

  for (const file of files) {
    let content = fileContentsCache.get(file);
    if (content === undefined) {
      try {
        content = fs.readFileSync(file, 'utf-8');
        fileContentsCache.set(file, content);
      } catch {
        fileContentsCache.set(file, '');
        continue;
      }
    }

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return true;
      }
    }
  }

  return false;
}


function main() {
  console.log('🔍 Finding unused translation keys...\n');

  let translationKeys = [];

  try {
    const localeContent = fs.readFileSync(LOCALE_FILE, 'utf-8');
    const localeData = JSON.parse(localeContent);
    translationKeys = flattenKeys(localeData);
    console.log(`📝 Found ${translationKeys.length} translation keys in en_GB.json`);
  } catch (error) {
    console.error(`❌ Error reading locale file: ${error.message}`);
    process.exit(1);
  }

  try {
    if (fs.existsSync(ACHIEVEMENTS_FILE)) {
      const achievementsContent = fs.readFileSync(ACHIEVEMENTS_FILE, 'utf-8');
      const achievementsData = JSON.parse(achievementsContent);
      const achievementKeys = flattenKeys(achievementsData, 'achievements');
      translationKeys.push(...achievementKeys);
      console.log(`📝 Found ${achievementKeys.length} achievement keys in achievements/en_GB.json`);
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not read achievements file: ${error.message}`);
  }

  console.log(`\n📊 Total keys to check: ${translationKeys.length}`);

  console.log('📂 Scanning source files...');
  const files = getAllFiles(SEARCH_DIR);
  console.log(`📄 Found ${files.length} files to search\n`);

  const fileContentsCache = new Map();

  const unusedKeys = [];
  const usedKeys = [];

  console.log('🔎 Searching for key usage (including template literals)...');

  let processed = 0;
  const totalKeys = translationKeys.length;
  const startTime = Date.now();

  for (const key of translationKeys) {
    processed++;

    if (processed % 10 === 0 || processed === totalKeys) {
      const percent = Math.round(processed / totalKeys * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r   Progress: ${processed}/${totalKeys} (${percent}%) - ${elapsed}s elapsed`);
    }

    if (isKeyUsed(key, files, fileContentsCache)) {
      usedKeys.push(key);
    } else {
      unusedKeys.push(key);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\r   Progress: ${totalKeys}/${totalKeys} (100%) - ${totalTime}s total   \n`);

  console.log('\n' + '='.repeat(70));
  console.log('📋 RESULTS');
  console.log('='.repeat(70) + '\n');

  console.log(`✅ Used keys: ${usedKeys.length}`);
  console.log(`❌ Unused keys: ${unusedKeys.length}`);
  console.log(`📊 Usage rate: ${((usedKeys.length / totalKeys) * 100).toFixed(2)}%\n`);

  if (unusedKeys.length > 0) {
    console.log('🗑️  Unused translation keys:\n');

    const grouped = {};
    unusedKeys.forEach(key => {
      const topLevel = key.split('.')[0];
      if (!grouped[topLevel]) {
        grouped[topLevel] = [];
      }
      grouped[topLevel].push(key);
    });

    Object.keys(grouped).sort().forEach(category => {
      console.log(`\n  ${category}:`);
      grouped[category].sort().forEach(key => {
        console.log(`    - ${key}`);
      });
    });

    const outputFile = path.join(__dirname, '../unused-translations.txt');
    const outputContent = [
      '# Unused Translation Keys',
      `# Generated: ${new Date().toISOString()}`,
      `# Total unused: ${unusedKeys.length}`,
      `# Note: This script checks for full keys and partial keys (last 2-3 segments)`,
      `# to catch dynamic template literal usage like \`\${PREFIX}.key\``,
      '',
      ...unusedKeys.sort()
    ].join('\n');

    fs.writeFileSync(outputFile, outputContent, 'utf-8');
    console.log(`\n💾 Full list saved to: ${path.relative(process.cwd(), outputFile)}`);
  } else {
    console.log('🎉 No unused translation keys found!');
  }

  console.log('\n' + '='.repeat(70) + '\n');

  if (unusedKeys.length > 0) {
    console.log('💡 Tip: You can safely remove these keys from your translation files to reduce bundle size.');
    console.log('⚠️  Note: Some keys might be used dynamically - review before removing!');
  }
}

main();
