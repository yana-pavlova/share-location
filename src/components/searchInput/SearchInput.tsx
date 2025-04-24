import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';
import { Search, ArrowLeft } from 'lucide-react';
import { searchAddress } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import { TSearchAddress } from '../../types';
import { SearchResults } from '../searchResults/SearchResults';
import { useMap } from 'react-leaflet';

export const SearchInput = () => {
	const [inputVisible, setInputVisible] = useState(false);
	const [resultsVisible, setResultsVisible] = useState(false);
	const [query, setQuery] = useState('');
	const [searchedAddress, setSearchAddress] = useState<TSearchAddress[] | null>(
		null
	);
	const ref = useRef<HTMLInputElement | null>(null);
	const map = useMap();
	const bounds = map.getBounds();
	const sw = bounds.getSouthWest();
	const ne = bounds.getNorthEast();
	const viewbox = [
		sw.lng, // min lon
		sw.lat, // min lat
		ne.lng, // max lon
		ne.lat, // max lat
	];

	const debouncedSearch = useDebounce(
		async (query: string, signal: AbortSignal) => {
			const addresses: TSearchAddress[] = await searchAddress(query, viewbox);

			if (!signal.aborted) {
				setSearchAddress(addresses);
			}
		},
		300
	);

	useEffect(() => {
		inputVisible ? ref.current?.focus() : setSearchAddress(null);
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
		if (searchedAddress) {
			setResultsVisible(true);
		}
	}, [searchedAddress]);

	return (
		<>
			<div className={styles.inputContainer}>
				{!inputVisible && (
					<button
						className={styles.searchButton}
						onClick={() => setInputVisible(true)}
					>
						<Search size={20} strokeWidth={2} color="#000" />
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
							<ArrowLeft size={20} strokeWidth={2} color="#000" />
						</button>
					</>
				)}
			</div>
			{searchedAddress && inputVisible && resultsVisible && (
				<SearchResults
					data={searchedAddress}
					setVisibilityFunctions={[setResultsVisible, setInputVisible]}
				/>
			)}
		</>
	);
};
