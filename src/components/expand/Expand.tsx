import { useEffect, useState } from 'react';
import styles from './expand.module.scss';
import { useMap } from 'react-leaflet';
import { MapControl } from '../map-control/MapControl';

export const Expand = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const mapContainer = useMap().getContainer();

	useEffect(() => {
		if (isExpanded) {
			mapContainer.classList.add(styles.expanded);
		} else {
			mapContainer.classList.remove(styles.expanded);
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
