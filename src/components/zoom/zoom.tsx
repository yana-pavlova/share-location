import { useEffect, useState } from 'react';
import styles from './zoom.module.scss';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useMap } from 'react-leaflet';

export const Zoom = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const map = useMap();

	useEffect(() => {
		if (isExpanded) {
			map.getContainer().classList.add(styles.expanded);
		} else {
			map.getContainer().classList.remove(styles.expanded);
		}
	}, [isExpanded, map]);

	return (
		<div
			className={styles.container}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			{isExpanded ? <Minimize2 /> : <Maximize2 />}
		</div>
	);
};
