import {createI18n} from 'vue-i18n';
import localeConfig from '@/configs/i18nLocales.js';
import axios from 'axios';

// 全域 i18n 實例，供組件直接 import 使用
export const i18nGlobal = createI18n({legacy: false, locale: 'zh'});

export const SUPPORT_LOCALES = localeConfig.map(({code}) => code);

export async function setupI18n(options = {locale: 'zh'}) {
  // 只初始化一次 i18nGlobal
  await loadLocaleMessages(i18nGlobal, options.locale);
  setI18nLanguage(i18nGlobal, options.locale);
  return i18nGlobal;
}

export function setI18nLanguage(i18n, locale) {
  // 確保正確地設置了 i18n global 的 locale
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  // 如果 URL 中有 locale 參數，則更新它

  if (searchParams.get('locale') !== locale) {
    searchParams.set('locale', locale);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  // 設置 HTML 文檔的 lang 屬性
  document.documentElement.setAttribute('lang', locale);
}

export async function loadLocaleMessages(i18n, locale) {
  const jsonList = [''];
  const messagesList = await Promise.all(
    jsonList.map((json) => axios.get(`./lang/${locale}${json}.json`)),
  );
  const messages = {};

  messagesList.forEach((item) => {
    Object.assign(messages, item.data);
  });
  console.log(locale, messages);
  i18n.global.setLocaleMessage(locale, messages);
  return nextTick();
}

export function getLocale() {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const localeFromSearch = searchParams.get('locale');

  if (localeFromSearch && SUPPORT_LOCALES.includes(localeFromSearch)) {
    return localeFromSearch;
  }
  return SUPPORT_LOCALES[0];
}
