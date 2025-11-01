import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationFA from "./locales/fa.json";

const resources = {
  en: { translation: translationEN },
  fa: { translation: translationFA }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // زبان پیش‌فرض
    fallbackLng: "fa",
    interpolation: { escapeValue: false }
  });

export default i18n;