const {default: I18N_LOCALE} = require('../../src/constants/I18N_LOCALE.js');

const mappings = {
  [I18N_LOCALE.JA]: /[\u3040-\u30ff\u4e00-\u9faf\u3400-\u4dbf\uff66-\uff9f]+/g, // 日文
  [I18N_LOCALE.ZH]: /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]+/g, // 中文
  [I18N_LOCALE.EN]: /[A-Za-z]+/g, // 英文
};

const getLanguageReg = (languageCode) => {
  if (!languageCode) return mappings[I18N_LOCALE.JA];
  return mappings[languageCode] || mappings[languageCode.toUpperCase()] || mappings['ja'];
};

module.exports = getLanguageReg;
