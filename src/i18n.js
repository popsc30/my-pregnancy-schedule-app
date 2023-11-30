import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "Welcome to React": "Welcome to React and react-i18next"
                    // 这里添加更多的英文翻译
                }
            },
            zh: {
                translation: {
                    "Welcome to React": "欢迎使用 React 和 react-i18next"
                    // 这里添加更多的中文翻译
                }
            }
        },
        lng: "en", // 如果需要，默认语言
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
