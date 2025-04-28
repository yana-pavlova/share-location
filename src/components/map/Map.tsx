import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import styles from './map.module.scss';
import {
	MapContainer,
	Popup,
	TileLayer,
	useMapEvents,
	ZoomControl,
} from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import CustomMarker from '@/components/marker/marker';
import FindMe from '@/components/findMe/FindMe';
import { fetchAddress } from '@/utils/api';
import { customIcon, MAX_ZOOM } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, selectMarkers } from '@/state/markersSlice';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '@/components/searchInput/SearchInput';
import { Expand } from '@/components/expand/Expand';
import { BeatLoader } from 'react-spinners';
import { concatenateAddress } from '@/utils/concatenateAddress';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

type MapProps = {
	mapRef: React.RefObject<L.Map>;
	location: {
		latitude: number;
		longitude: number;
	};
};

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MyMap = ({ mapRef, location }: MapProps) => {
	const [popupPosition, setPopupPosition] = useState<null | LatLng>(null);
	const [isLoading, setIsLoading] = useState(false);

	const markers = useSelector(selectMarkers);
	const dispatch = useDispatch();

	const t = useTranslation().t;
	const buttonText = t('addPointButton');

	const getAddress = async (latitude: number, longitude: number) => {
		const address = await fetchAddress(latitude, longitude);
		return concatenateAddress(address);
	};

	const AddMarkerOnClick = () => {
		useMapEvents({
			click(e) {
				const clickSource = e.originalEvent.target as HTMLElement;
				if (clickSource.id === 'map') {
					setPopupPosition(e.latlng);
				}
			},
		});
		return null;
	};

	const handleSubmitButton = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		setIsLoading(true);

		const address = await getAddress(popupPosition!.lat, popupPosition!.lng);
		dispatch(
			addMarker({
				id: uuidv4(),
				text: address || '',
				position: [popupPosition!.lat, popupPosition!.lng],
				highlighted: false,
			})
		);

		setIsLoading(false);
		setPopupPosition(null);
	};

	useEffect(() => {
		mapRef.current?.setView(
			location ? [location.latitude, location.longitude] : [51.505, -0.09],
			MAX_ZOOM
		);
	}, [location]);

	return (
		<>
			<MapContainer
				ref={mapRef}
				id="map"
				className={styles.map}
				center={[location.latitude, location.longitude]}
				zoom={13}
				zoomControl={false}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<AddMarkerOnClick />
				{popupPosition && (
					<Popup position={popupPosition}>
						<form action="submit">
							<button
								className={styles.popupButton}
								type="submit"
								onClick={handleSubmitButton}
							>
								{buttonText}
							</button>
						</form>
					</Popup>
				)}
				{markers &&
					markers.map((marker) => (
						<CustomMarker
							{...(marker.currentLocation ? { icon: customIcon } : {})}
							id={marker.id}
							key={marker.id}
							marker={marker}
							position={marker.position}
						/>
					))}
				<SearchInput />
				<Expand />
				<ZoomControl position="bottomleft" />
				<FindMe />
				{isLoading && (
					<BeatLoader
						color="#2880ca"
						size={30}
						cssOverride={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							zIndex: 1000,
						}}
					/>
				)}
			</MapContainer>
		</>
	);
};

export default MyMap;
