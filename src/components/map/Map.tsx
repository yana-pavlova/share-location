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
import CustomMarker from '../marker/marker';
import FindMe from '../findMe/FindMe';
import { fetchAddress } from '../../utils/api';
import { customIcon, MAX_ZOOM } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, selectMarkers } from '../../state/markersSlice';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../searchInput/SearchInput';
import { Zoom } from '../zoom/zoom';

type MapProps = {
	mapRef: React.RefObject<L.Map>;
	location: {
		latitude: number;
		longitude: number;
	};
};

const MyMap = ({ mapRef, location }: MapProps) => {
	const [popupPosition, setPopupPosition] = useState<null | LatLng>(null);

	const markers = useSelector(selectMarkers);
	const dispatch = useDispatch();

	const t = useTranslation().t;
	const buttonText = t('addPointButton');

	const getAddress = async (latitude: number, longitude: number) => {
		const address = await fetchAddress(latitude, longitude);
		const addressText = [
			address?.country,
			address?.city,
			address?.town,
			address?.village,
			address?.road,
			address?.house_number,
			address?.hamlet,
		]
			.filter(Boolean)
			.join(', ');

		return addressText;
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

	const handleSubmitButton = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		getAddress(popupPosition!.lat, popupPosition!.lng).then((address) => {
			dispatch(
				addMarker({
					id: uuidv4(),
					text: address || '',
					position: [popupPosition!.lat, popupPosition!.lng],
					highlighted: false,
				})
			);
		});

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
				<ZoomControl position="bottomleft" />
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
				<Zoom />
				<FindMe />
			</MapContainer>
		</>
	);
};

export default MyMap;
