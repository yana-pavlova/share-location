import { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

const LocationMarker = () => {
	const [position, setPosition] = useState<LatLng | null>(null);
	const map = useMapEvents({
		click(e) {
			map.locate();
			setPosition(e.latlng);
		},
		locationfound(e) {
			console.log(e);
		},
	});

	return position === null ? null : (
		<Marker position={position}>
			<Popup>You are here</Popup>
		</Marker>
	);
};

export default LocationMarker;
