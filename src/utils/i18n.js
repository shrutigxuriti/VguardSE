import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import locales from './locales';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    ...locales,
  },
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
