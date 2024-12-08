import image from '../../img/find-me.svg';
import styles from './findMe.module.scss';
import { fetchLocation } from '../../utils/api';
import { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type TFindMeProps = {
	setCurrentLocation: React.Dispatch<
		React.SetStateAction<{
			latitude: number;
			longitude: number;
		} | null>
	>;
};

const FindMe = ({ setCurrentLocation }: TFindMeProps) => {
	const [myLocationIsFound, setmyLocationIsFound] = useState(false);
	const [myCoords, setMyCoords] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const map = useMap();

	const getLocation = async () => {
		if (!myLocationIsFound) {
			const coords = await fetchLocation();
			if (coords) {
				setMyCoords(coords);
				setCurrentLocation({
					latitude: coords.latitude,
					longitude: coords.longitude,
				});
				setmyLocationIsFound(true);
				map.setView(L.latLng(coords.latitude, coords.longitude), map.getZoom());
			}
		}
		if (myCoords)
			map.setView(
				L.latLng(myCoords.latitude, myCoords.longitude),
				map.getZoom()
			);
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
