import styles from './footer.module.scss';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			© 2024 Yana Pavlova
			<p className={styles.smallText}>
				If you notice any bugs, please, report them on{' '}
				<a href="https://github.com/yana-pavlova/share-location/issues">
					Github
				</a>
			</p>
		</footer>
	);
};

export default Footer;
