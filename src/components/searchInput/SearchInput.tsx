import { useState, useRef, useEffect } from 'react';
import styles from './searchInput.module.scss';
import { Search, ArrowLeft } from 'lucide-react';
import { searchAdress } from '../../utils/api';
import { useDebounce } from '../../hooks/useDebounce';
import { TSearchAddress } from '../../types';
import { useMap } from 'react-leaflet';

export const SearchInput = () => {
	const map = useMap();

	const [inputVisible, setInputVisible] = useState(false);
	const [query, setQuery] = useState('');
	const [searchAddress, setSearchAddress] = useState<TSearchAddress[] | null>(
		null
	);
	const ref = useRef<HTMLInputElement | null>(null);
	const searchAddressRef = useRef<HTMLUListElement | null>(null);

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
		const handleWheel = (e: WheelEvent) => {
			if (searchAddressRef.current)
				searchAddressRef.current.scrollTop += e.deltaY;
			map.scrollWheelZoom.disable();
			e.preventDefault();
		};
		searchAddressRef.current?.addEventListener('wheel', handleWheel, {
			passive: false,
		});

		return () => {
			searchAddressRef.current?.removeEventListener('wheel', handleWheel);
		};
	}, [searchAddress]);

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
			{searchAddress && inputVisible && (
				<>
					{searchAddress.length === 0 && (
						<ul
							ref={searchAddressRef}
							className={`${styles.searchResult} custom-scroll`}
						>
							<li>No results</li>
						</ul>
					)}
					{searchAddress.length > 0 && (
						<ul
							ref={searchAddressRef}
							className={`${styles.searchResult} custom-scroll`}
						>
							{searchAddress.map((address) => (
								<li key={address.lat}>
									{address.display_name}
									<br />
									{address.lat}
									<br />
									{address.lon}
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</>
	);
};
