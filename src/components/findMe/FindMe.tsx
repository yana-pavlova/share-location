import { fetchLocation } from '@/utils/api';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { addCurrentLocation } from '@/state/markersSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { MAX_ZOOM } from '@/utils/constants';
import { MapControl } from '@/components/map-control/MapControl';

const FindMe = () => {
	const dispatch = useDispatch();
	const map = useMap();

	const getLocation = async () => {
		const coords = await fetchLocation();
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
		<div onClick={getLocation}>
			<MapControl icon="arrow" hPosition="right" vPosition="bottom" />
		</div>
	);
};

export default FindMe;
