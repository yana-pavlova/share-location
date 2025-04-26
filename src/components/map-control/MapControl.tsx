import {
	Maximize2,
	Minimize2,
	MousePointer2,
	Search,
	ZoomIn,
	ZoomOut,
} from 'lucide-react';
import styles from './MapControl.module.scss';
import clsx from 'clsx';

interface MapControlProps {
	icon: 'minimize' | 'maximize' | 'arrow' | 'search' | 'zoom-in' | 'zoom-out';
	hPosition: 'left' | 'right';
	vPosition: 'top' | 'bottom' | 'zoom';
}

export const MapControl = ({ icon, hPosition, vPosition }: MapControlProps) => {
	return (
		<div
			className={clsx(styles.mapControl, styles[vPosition], styles[hPosition])}
		>
			{icon === 'minimize' && <Minimize2 />}
			{icon === 'maximize' && <Maximize2 />}
			{icon === 'arrow' && (
				<MousePointer2 style={{ transform: 'scaleX(-1)' }} />
			)}
			{icon === 'search' && <Search style={{ top: 0, left: 0 }} />}
			{icon === 'zoom-in' && <ZoomIn />}
			{icon === 'zoom-out' && <ZoomOut />}
		</div>
	);
};
