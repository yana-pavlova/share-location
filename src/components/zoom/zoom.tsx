import { useEffect, useState } from 'react';
import styles from './zoom.module.scss';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useMap } from 'react-leaflet';

export const Zoom = () => {
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
			{isExpanded ? <Minimize2 color="#000" /> : <Maximize2 color="#000" />}
		</div>
	);
};
