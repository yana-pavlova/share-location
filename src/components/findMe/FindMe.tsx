import styles from './findMe.module.scss';
import { fetchLocation } from '../../utils/api';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { addCurrentLocation } from '../../state/markersSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { MAX_ZOOM } from '../../utils/constants';
import { MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FindMe = () => {
	const dispatch = useDispatch();
	const map = useMap();
	const { t } = useTranslation();

	const getLocation = async () => {
		const coords = await fetchLocation(t);
		if (coords) {
			dispatch(
				addCurrentLocation({
					position: [coords.latitude, coords.longitude],
					text: "You're here",
					id: uuidv4(),
				})
			);

			map.setView(L.latLng(coords.latitude, coords.longitude), MAX_ZOOM);
		}
	};

	return (
		<div className={styles.container} onClick={getLocation}>
			<MousePointer2 style={{ transform: 'scaleX(-1)' }} />
		</div>
	);
};

export default FindMe;
