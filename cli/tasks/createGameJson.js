const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const getPaths = require('../utils/getPath.js');
const {getRootPath} = require('../utils/utils.js');
const getDataFiles = require('../utils/getDataFiles.js');
const readJsonFile = require('../utils/readJsonFile.js');

const getI18nKeys = (dataFilePaths) => {
  const i18nKeys = new Set();
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

  const addKey = (object) => {
    if (typeof object === 'string') {
      i18nKeys.add(object);
    } else if (Array.isArray(object)) {
      object.forEach((item) => {
        addKey(item);
      });
    } else if (typeof object === 'object' && object !== null) {
      attrs.forEach((key) => {
        addKey(object[key]);
      });
    }
  };
  dataFilePaths.forEach((filePath) => {
    const jsonData = readJsonFile(filePath);
    addKey(jsonData);
  });
  return i18nKeys;
};

async function createGameJson({gameDir, language}) {
  const {wwwDir} = getPaths(gameDir);
  const files = getDataFiles(wwwDir);
  const keys = getI18nKeys(files);
  const gameJson = {};
  keys.forEach((key) => {
    gameJson[key] = key;
  });
  const rootDir = getRootPath();
  const outputDir = path.join(rootDir, './translations/');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }
  const outputPath = path.join(outputDir, `${language.to}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(gameJson, null, 2), 'utf8');
  console.log(chalk.greenBright(`Writing game JSON to ${outputPath}...`));
}

module.exports = createGameJson;
