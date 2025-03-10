import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';
import { Search, ArrowLeft } from 'lucide-react';
import { searchAdress } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import { TSearchAddress } from '../../types';
import { SearchResults } from '../searchResults/SearchResults';

export const SearchInput = () => {
	const [inputVisible, setInputVisible] = useState(false);
	const [resultsVisible, setResultsVisible] = useState(false);
	const [query, setQuery] = useState('');
	const [searchAddress, setSearchAddress] = useState<TSearchAddress[] | null>(
		null
	);
	const ref = useRef<HTMLInputElement | null>(null);

	const filterUniqueAddresses = (addresses: TSearchAddress[]) => {
		const seenNames = new Set<string>();
		const seenCoords = new Set<string>();

		return addresses.filter(({ display_name, lat, lon }) => {
			const nameKey = `${display_name}`;
			const coordsKey = `${lat},${lon}`;
			if (seenNames.has(nameKey) || seenCoords.has(coordsKey)) {
				return false;
			}
			seenNames.add(nameKey);
			seenCoords.add(coordsKey);
			return true;
		});
	};

	const sortAddresses = (addresses: TSearchAddress[]) => {
		return addresses.sort((a, b) => {
			return b.importance - a.importance;
		});
	};

	const debouncedSearch = useDebounce(
		async (query: string, signal: AbortSignal) => {
			const address = await searchAdress(query);

			if (!signal.aborted) {
				const filteredAddresses = filterUniqueAddresses(address);
				const sortedAddresses = sortAddresses(filteredAddresses);
				console.log(sortedAddresses);

				setSearchAddress(sortedAddresses);
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

	useEffect(() => {
		if (searchAddress) {
			setResultsVisible(true);
		}
	}, [searchAddress]);

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
			{searchAddress && inputVisible && resultsVisible && (
				<SearchResults
					data={searchAddress}
					setVisibilityFunctions={[setResultsVisible, setInputVisible]}
				/>
			)}
		</>
	);
};
