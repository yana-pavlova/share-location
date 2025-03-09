import { useEffect, useRef, useState } from 'react';
import { TSearchAddress } from '../../types';
import styles from './searchResults.module.scss';
import { useMap } from 'react-leaflet';

export const SearchResults = ({ data }: { data: TSearchAddress[] }) => {
	// const [results, setResults] = useState<TSearchAddress[]>(data);

	const searchAddressRef = useRef<HTMLUListElement>(null);
	const map = useMap();

	useEffect(() => {
		map.scrollWheelZoom.disable();
		return () => {
			map.scrollWheelZoom.enable();
		};
	}, [data]);

	return (
		<ul
			ref={searchAddressRef}
			className={`${styles.searchResult} custom-scroll`}
		>
			{data.length === 0 ? (
				<li>No results</li>
			) : (
				data.map((address) => (
					<li key={address.lat}>
						{address.display_name}
						<br />
						{address.lat}
						<br />
						{address.lon}
					</li>
				))
			)}
		</ul>
	);
};
