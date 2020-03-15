import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';
import en from './en';
import hu from './hu';

i18n.use(initReactI18next).use(LanguageDetector).init({
  resources: {
    en,
    hu
  },

  fallbackLng: 'hu',
  // lng: i18n.language || 'hu',
  debug: process.env.NODE_ENV !== 'production',

  missingInterpolationHandler: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  },

  cleanCode: true,
  lowerCaseLng: true,
});

export default i18n;