const path = require('path');
const chalk = require('chalk');
const getPaths = require('../utils/getPath.js');
const {getRootPath} = require('../utils/utils.js');
const getDataFiles = require('../utils/getDataFiles.js');
const readJsonFile = require('../utils/readJsonFile.js');
const fs = require('fs');

const replaceKeysInDataFiles = (dataFilePaths, keyMapping) => {
  const messageCount = 9;
  const messageAttrs = Array.from({length: messageCount}, (_, i) => `message${i + 1}`);
  const attrs = [
    'name',
    'description',
    'note',
    'text',
    'events',
    'pages',
    'list',
    'parameters',
    ...messageAttrs,
  ];

  const replaceKey = (object, key, value) => {
    if (typeof value === 'string') {
      object[key] = keyMapping[value] || value;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        replaceKey(value, index, item);
      });
    } else if (typeof value === 'object' && value !== null) {
      if (!value.code || ![108].includes(value.code)) {
        attrs.forEach((key) => {
          replaceKey(value, key, value[key]);
        });
      }
    }
  };
  dataFilePaths.forEach((filePath) => {
    const jsonData = readJsonFile(filePath);
    replaceKey(jsonData, null, jsonData);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
  });
};

const clearTranslatedJson = () => {
  const rootDir = getRootPath();
  const dir = path.join(rootDir, './translations/');
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(dir, file));
    }
  });
};

async function replaceGameJson({gameDir, language}) {
  const {wwwDir} = getPaths(gameDir);
  const files = getDataFiles(wwwDir);
  const rootDir = getRootPath();
  const i18nKeysPath = path.join(rootDir, `./translations/${language.to}_translated.json`);
  const keyMapping = readJsonFile(i18nKeysPath);
  if (keyMapping) {
    replaceKeysInDataFiles(files, keyMapping);
    clearTranslatedJson();
    console.log(chalk.greenBright('Game JSON replacement completed successfully.'));
  } else {
    console.error(chalk.redBright(`Error: Translated JSON file not found at ${i18nKeysPath}`));
  }
}

module.exports = replaceGameJson;
