import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';

export const SearchInput = () => {
	const [inputVisible, setInputVisible] = useState(false);
	const ref = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (inputVisible) {
			ref.current?.focus();
		}
	}, [inputVisible]);

	return (
		<>
			{!inputVisible && (
				<button
					className={styles.searchButton}
					onClick={() => setInputVisible(true)}
				>
					🔍
				</button>
			)}
			{inputVisible && (
				<input
					ref={ref}
					className={styles.input}
					type="text"
					onBlur={() => setInputVisible(false)}
				/>
			)}
		</>
	);
};
