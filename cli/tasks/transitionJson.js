const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {getRootPath} = require('../utils/utils.js');
const createBar = require('../utils/createBar.js');
const runManyPromises = require('../utils/runManyPromises.js');
const {default: translate} = require('translate');
const readJsonFile = require('../utils/readJsonFile.js');
const getLanguageReg = require('../utils/getLanguageReg.js');

const getArray = (text, language) => {
  // 這個正則會抓出所有連續的日文片段
  const reg = getLanguageReg(language);
  return text.match(reg) || [];
};

const updateJsonFile = (filePath, newJson) => {
  fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf8');
};

const translations = async (keyMapping, language, progressCb, current = 0) => {
  const rootDir = getRootPath();
  const newPath = path.join(rootDir, `./translations/${language.to}_translated.json`);
  const gameJson = {};
  const bar = createBar(' {bar} | {value}/{total}');
  const record = fs.existsSync(newPath) ? readJsonFile(newPath) : {};

  const total = Object.keys(keyMapping).length;
  bar.start(total, 0);

  const _translate = async (key, tryCount = 0) => {
    if (record[key]) {
      gameJson[key] = record[key];
    } else {
      try {
        // 檢查是否為 'XXXX = AAAA' 格式
        const eqMatch = key.match(/^([^=]+?=\s*)(.*)$/);
        let newText = key;
        if (eqMatch) {
          // 只翻譯等號後的內容
          const prefix = eqMatch[1];
          const value = eqMatch[2];
          const jpArray = getArray(value, language.from);
          let translatedValue = value;
          if (jpArray.length) {
            const results = await Promise.all(
              jpArray.map((jp) => translate(jp, {from: language.from, to: language.to})),
            );
            results.forEach((res, index) => {
              translatedValue = translatedValue.replace(jpArray[index], res);
            });
          }
          newText = prefix + translatedValue;
        } else {
          const jpArray = getArray(key, language.from);
          if (jpArray.length) {
            const results = await Promise.all(
              jpArray.map((jp) => translate(jp, {from: language.from, to: language.to})),
            );
            results.forEach((res, index) => {
              newText = newText.replace(jpArray[index], res);
            });
          }
        }
        gameJson[key] = newText;
      } catch (error) {
        if (tryCount < 10) {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          return _translate(key, tryCount + 1);
        }

        // Log the error but continue processing other keys
        bar.log(
          chalk.redBright(
            `Error translating key "${key.replaceAll('\n', '')}": ${error.message.replaceAll('\n', '')}`,
          ),
        );
        gameJson[key] = key;
      }
    }
    bar.increment();
    current++;
    if (progressCb) progressCb(current, total);
    if (bar.value % 50 === 0) {
      updateJsonFile(newPath, gameJson);
    }
  };
  const promiseArray = keyMapping.map((key) => () => _translate(key));
  await runManyPromises(promiseArray, {limit: 10, delay: 0});
  updateJsonFile(newPath, gameJson);
  bar.stop();
  return gameJson;
};

async function transitionJsonTask({language, onProgress}) {
  const rootDir = getRootPath();
  const i18nKeysPath = path.join(rootDir, `./translations/${language.to}.json`);
  console.log(i18nKeysPath);
  const keyMapping = fs.existsSync(i18nKeysPath) ? Object.keys(readJsonFile(i18nKeysPath)) : [];
  // 包裝進度
  const progressCb = (current, total) => {
    const percent = Math.round((current / total) * 100);
    if (onProgress) onProgress(percent, `${current}/${total}`);
  };
  await translations(keyMapping, language, progressCb);
  if (onProgress) onProgress(100, `${keyMapping.length}/${keyMapping.length}`);
  console.log(chalk.greenBright(`Translation for ${language.to} completed.`));
}

module.exports = transitionJsonTask;
