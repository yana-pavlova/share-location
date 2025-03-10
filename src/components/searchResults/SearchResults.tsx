import { useEffect, useRef } from 'react';
import { TSearchAddress } from '../../types';
import styles from './searchResults.module.scss';
import { useMap } from 'react-leaflet';

export const SearchResults = ({
	data,
	setVisibilityFunctions,
}: {
	data: TSearchAddress[];
	setVisibilityFunctions: React.Dispatch<React.SetStateAction<boolean>>[];
}) => {
	const searchAddressRef = useRef<HTMLUListElement>(null);
	const map = useMap();

	const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
		const coords = e.currentTarget.dataset.coords;
		if (!coords) return;

		if (searchAddressRef.current) {
			searchAddressRef.current.style.display = 'none';
		}

		setVisibilityFunctions.forEach((func) => func(false));

		const lat = +coords.split(',')[0];
		const lng = +coords.split(',')[1];

		map.setView([lat, lng], map.getMaxZoom());
	};

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
					<li
						onClick={handleClick}
						key={address.place_id}
						data-coords={`${address.lat},${address.lon}`}
					>
						{address.display_name}
					</li>
				))
			)}
		</ul>
	);
};
