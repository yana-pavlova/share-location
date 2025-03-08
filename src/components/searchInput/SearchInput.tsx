import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';
import { Search } from 'lucide-react';

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
					<Search size={20} strokeWidth={2} />
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
