import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enTranslation from "../locales/en/translation.json";
import ruTranslation from "../locales/ru/translation.json";
import kkTranslation from "../locales/kk/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    // Load translations from imported JSON files
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      kk: {
        translation: kkTranslation,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
