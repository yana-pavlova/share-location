import i18next from 'i18next';
import styles from './header.module.scss';

const Header = () => {
	const handleChangeLanguage = (language: string) => {
		i18next.changeLanguage(language);
		localStorage.setItem('language', language);
	};

	return (
		<header className={styles.header}>
			<span className={styles.logo}>Share location easily</span>
			<button
				disabled={i18next.language === 'ru'}
				className={styles.langButton}
				onClick={() => handleChangeLanguage('ru')}
			>
				RU
			</button>
			<button
				disabled={i18next.language === 'en'}
				className={styles.langButton}
				onClick={() => handleChangeLanguage('en')}
			>
				EN
			</button>
		</header>
	);
};

export default Header;
