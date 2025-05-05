import { useEffect, useState } from 'react';
import styles from './expand.module.scss';
import { useMap } from 'react-leaflet';
import { MapControl } from '@/components/map-control/MapControl';

export const Expand = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const map = useMap();
	const mapContainer = map.getContainer();

	useEffect(() => {
		if (isExpanded) {
			mapContainer.classList.add(styles.expanded);
			map.invalidateSize();
		} else {
			mapContainer.classList.remove(styles.expanded);
			map.invalidateSize();
		}
	}, [isExpanded, mapContainer]);

	return (
		<div
			className={`map-control-container ${styles.container}`}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			{isExpanded ? (
				<MapControl icon="minimize" hPosition="right" vPosition="top" />
			) : (
				<MapControl icon="maximize" hPosition="right" vPosition="top" />
			)}
		</div>
	);
};
