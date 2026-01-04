<template>
  <div class="i18n-switch">
    <BaseSelect v-model="currentLocale" :options="localeOptions" :placeholder="$t('請選擇語言')" />
  </div>
</template>

<script setup>
// 直接 import 全域 i18n 實例
import {i18nGlobal} from '@/i18n/index.js';
import i18nLocales from '@/configs/i18nLocales.js';
import {loadLocaleMessages, setI18nLanguage} from '@/i18n/index.js';

const currentLocale = computed({
  get: () => i18nGlobal.global.locale.value,
  set: async (val) => {
    await loadLocaleMessages(i18nGlobal, val);
    setI18nLanguage(i18nGlobal, val);
  },
});

const localeOptions = computed(() =>
  i18nLocales.map((config) => ({
    label: config.name,
    value: config.code,
  })),
);
</script>

<style scoped>
.i18n-switch {
  position: absolute;
  top: 18px;
  right: 32px;
  z-index: 100;
}
</style>
