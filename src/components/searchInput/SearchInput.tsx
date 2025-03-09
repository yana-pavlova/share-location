import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';
import { Search, ArrowLeft } from 'lucide-react';
import { searchAdress } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import { TSearchAddress } from '../../types';
import { SearchResults } from '../searchResults/SearchResults';

export const SearchInput = () => {
	const [inputVisible, setInputVisible] = useState(false);
	const [query, setQuery] = useState('');
	const [searchAddress, setSearchAddress] = useState<TSearchAddress[] | null>(
		null
	);
	const ref = useRef<HTMLInputElement | null>(null);

	const debouncedSearch = useDebounce(
		async (query: string, signal: AbortSignal) => {
			const address = await searchAdress(query);

			if (!signal.aborted) {
				setSearchAddress(address);
			}
		},
		300
	);

	useEffect(() => {
		if (inputVisible) {
			ref.current?.focus();
		}

		if (!inputVisible) {
			setSearchAddress(null);
		}
	}, [inputVisible]);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		if (query.trim().length === 0) {
			setSearchAddress(null);
			controller.abort();
		}

		if (query.trim().length > 2) {
			debouncedSearch(query, signal);
		}

		return () => controller.abort();
	}, [query]);

	return (
		<>
			<div className={styles.inputContainer}>
				{!inputVisible && (
					<button
						className={styles.searchButton}
						onClick={() => setInputVisible(true)}
					>
						<Search size={20} strokeWidth={2} />
					</button>
				)}
				{inputVisible && (
					<>
						<input
							ref={ref}
							className={styles.input}
							type="text"
							onChange={(e) => setQuery(e.target.value)}
						/>
						<button
							className={styles.closeButton}
							onClick={() => setInputVisible(false)}
						>
							<ArrowLeft size={20} strokeWidth={2} />
						</button>
					</>
				)}
			</div>
			{searchAddress && inputVisible && <SearchResults data={searchAddress} />}
		</>
	);
};
