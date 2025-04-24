import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { Marker, useMap } from 'react-leaflet';
import { TMarker } from '../../types';
import { fetchAddress } from '../../utils/api';
import { useDispatch } from 'react-redux';
import { updateAddress } from '../../state/markersSlice';
import { MAX_ZOOM } from '../../utils/constants';
import { toast } from 'react-toastify';
import { useCopyLink } from '../../hooks/useCopyLink';

type CustomMarkerProps = {
	id: string;
	marker: TMarker;
	position: [number, number];
	icon?: L.Icon;
};

const CustomMarker = ({ id, marker, position, icon }: CustomMarkerProps) => {
	const map = useMap();
	const dispatch = useDispatch();
	const copyLink = useCopyLink();

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

	const addMarkerID = (e: LeafletEvent) => {
		const markerElement = e.target.getElement() as HTMLElement;
		markerElement.classList.add('img-' + id);
	};

	const handleClick = (e: LeafletMouseEvent) => {
		map.setView(e.target.getLatLng(), MAX_ZOOM);

		console.log(position);
		let url = window.location.origin;
		const lat = position[0];
		const lng = position[1];
		const textToCopy = `${url}?lat=${lat}&lng=${lng}`;

		copyLink(textToCopy);
	};

	const handleMouseOver = (e: LeafletMouseEvent) => {
		e.target.setOpacity(1);
		const liItem = document.getElementById(id);
		liItem?.classList.add('li-highlighted');
	};

	const handleMouseOut = (e: LeafletMouseEvent) => {
		e.target.setOpacity(0.5);
		const liItem = document.getElementById(id);
		liItem?.classList.remove('li-highlighted');
	};

	const handleDragEnd = (e: LeafletEvent) => {
		const coords = e.target.getLatLng();
		const newPosition: [number, number] = [coords.lat, coords.lng];

		getAddress(coords.lat, coords.lng).then((address) => {
			dispatch(
				updateAddress({
					id: id,
					newPosition: newPosition,
					text: address || 'Неизвестный адрес',
				})
			);
		});
	};

	return (
		<Marker
			eventHandlers={{
				click: handleClick,
				mouseover: handleMouseOver,
				mouseout: handleMouseOut,
				dragend: handleDragEnd,
				add: addMarkerID,
			}}
			key={marker.id}
			draggable={icon ? false : true}
			position={marker.position}
			opacity={0.5}
			data-coords={marker.position.join(',')}
			{...(icon ? { icon: icon } : {})}
		></Marker>
	);
};

export default CustomMarker;
