import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ko from "@/locales/ko.json";
import en from "@/locales/en.json";

const resources = {
    ko: { translation: ko },
    en: { translation: en },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "en";
const initialLanguage = deviceLanguage === "ko" ? "ko" : "en";

i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: "v3",
});

export default i18n;
