import image from '../../img/find-me.svg';
import styles from './findMe.module.scss';
import { fetchLocation } from '../../utils/api';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {
	addCurrentLocation,
	selectCurrentLocation,
} from '../../state/markersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const FindMe = () => {
	const dispatch = useDispatch();
	const map = useMap();
	const curLoc = useSelector(selectCurrentLocation);

	const getLocation = async () => {
		if (!curLoc) {
			const coords = await fetchLocation();
			if (coords) {
				dispatch(
					addCurrentLocation({
						position: [coords.latitude, coords.longitude],
						text: "You're here",
						id: uuidv4(),
					})
				);

				map.setView(L.latLng(coords.latitude, coords.longitude), map.getZoom());
			}
		}
		if (curLoc) map.setView(L.latLng(curLoc[0], curLoc[1]), map.getZoom());
	};

	return (
		<img
			onClick={getLocation}
			className={styles.image}
			src={image}
			alt="Find me"
		/>
	);
};

export default FindMe;
