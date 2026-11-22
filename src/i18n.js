import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      app_name: 'Agro Zenith',
      tagline: 'Empowering Agriculture · Predicting Harvests',
    }
  },
  ta: {
    translation: {
      app_name: 'Agro Zenith',
      tagline: 'விவசாயத்தை ক்ষமதর்ப்পதி · பயிர் அறுவடை முன்னறிவித்தல்',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
