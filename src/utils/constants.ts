import iconUrl from '../img/marker.svg';
import shadowUrl from '../img/marker-shadow.svg';
import L from 'leaflet';

export const customIcon = L.icon({
	iconUrl: iconUrl,
	shadowUrl: shadowUrl,
	iconSize: [25, 41],
	shadowSize: [41, 41],
	iconAnchor: [12, 41],
	shadowAnchor: [12, 41],
	popupAnchor: [1, -34],
});
