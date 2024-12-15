import i18next from 'i18next';
import styles from './header.module.scss';

const Header = () => {
	return (
		<header className={styles.header}>
			<span className={styles.logo}>Share location easily</span>
			<button
				disabled={i18next.language === 'ru'}
				className={styles.langButton}
				onClick={() => i18next.changeLanguage('ru')}
			>
				RU
			</button>
			<button
				disabled={i18next.language === 'en'}
				className={styles.langButton}
				onClick={() => i18next.changeLanguage('en')}
			>
				EN
			</button>
		</header>
	);
};

export default Header;
