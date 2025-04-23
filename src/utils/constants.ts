import iconUrl from '../img/marker.svg';
import shadowUrl from '../img/marker-shadow.svg';
import L from 'leaflet';
import i18next from 'i18next';

export const customIcon = L.icon({
	iconUrl: iconUrl,
	shadowUrl: shadowUrl,
	iconSize: [25, 41],
	shadowSize: [41, 41],
	iconAnchor: [12, 41],
	shadowAnchor: [12, 41],
	popupAnchor: [1, -34],
});

export const MAX_ZOOM = 18;
export const t = i18next.t.bind(i18next);
