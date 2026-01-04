const path = require('path');
const chalk = require('chalk');
const getPaths = require('../utils/getPath.js');
const {getRootPath} = require('../utils/utils.js');
const getDataFiles = require('../utils/getDataFiles.js');
const readJsonFile = require('../utils/readJsonFile.js');
const fs = require('fs');

async function replaceGameJsonByAiJson({gameDir, language, jsonFilePath, onProgress}) {
  console.log({gameDir, language, jsonFilePath});
  const {wwwDir} = getPaths(gameDir);
  const keyMapping = readJsonFile(jsonFilePath);
  const files = getDataFiles(wwwDir);
  if (keyMapping) {
    const keys = Object.keys(keyMapping)
      .map((key) => {
        return {
          key,
          value: keyMapping[key],
        };
      })
      .sort((a, b) => a.key.length - b.key.length);
    // 進度條回報
    const total = files.length;
    files.forEach((filePath, idx) => {
      const jsonData = readJsonFile(filePath);
      const message = `翻譯 ${path.basename(filePath)}`;
      // 進度百分比
      if (onProgress) {
        const percent = Math.round(((idx + 1) / total) * 100);
        onProgress(percent, message);
      }
      // 執行翻譯
      const replaceKey = (object, key, value) => {
        if (typeof value === 'string') {
          if (object[key]) {
            keys.forEach((i18nKey) => {
              object[key] = object[key].replaceAll(i18nKey.key, i18nKey.value);
            });
          }
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            replaceKey(value, index, item);
          });
        } else if (typeof value === 'object' && value !== null) {
          if (!value.code || ![108].includes(value.code)) {
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
            attrs.forEach((key) => {
              replaceKey(value, key, value[key]);
            });
          }
        }
      };
      replaceKey(jsonData, null, jsonData);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    });
    console.log(chalk.greenBright('Game JSON replacement completed successfully.'));
  } else {
    console.error(chalk.redBright(`Error: Translated JSON file not found at ${i18nKeysPath}`));
  }
}

module.exports = replaceGameJsonByAiJson;
