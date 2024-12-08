import image from '../../img/find-me.svg';
import styles from './findMe.module.scss';
import { fetchLocation } from '../../utils/api';
import { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type TFindMeProps = {
	currentLocation: {
		latitude: number;
		longitude: number;
	} | null;
	setCurrentLocation: React.Dispatch<
		React.SetStateAction<{
			latitude: number;
			longitude: number;
		} | null>
	>;
};

const FindMe = ({ currentLocation, setCurrentLocation }: TFindMeProps) => {
	const map = useMap();

	const getLocation = async () => {
		if (!currentLocation) {
			const coords = await fetchLocation();
			if (coords) {
				setCurrentLocation({
					latitude: coords.latitude,
					longitude: coords.longitude,
				});
				map.setView(L.latLng(coords.latitude, coords.longitude), map.getZoom());
			}
		}
		if (currentLocation)
			map.setView(
				L.latLng(currentLocation.latitude, currentLocation.longitude),
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
