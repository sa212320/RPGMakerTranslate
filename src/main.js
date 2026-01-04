import '@/assets/css/main.scss';
import App from './App.vue';
import {getLocale, setupI18n} from '@/i18n';

const main = async () => {
  const i18n = await setupI18n({locale: getLocale()});
  const app = createApp(App);

  app.use(i18n);
  app.mount('#app');
};

main();
