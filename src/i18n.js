import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { engText } from './lang/en';
import { ruText } from './lang/ru';

const resources = {
	en: { translation: engText },
	ru: { translation: ruText },
};

i18n.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem('language') || 'en',

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
