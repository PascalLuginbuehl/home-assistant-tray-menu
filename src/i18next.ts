import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './i18n/translation_en.json';

const resources = {
  en: {
    ...translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
