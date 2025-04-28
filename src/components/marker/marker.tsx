import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { Marker } from 'react-leaflet';
import { TMarker } from '@/types';
import { fetchAddress } from '@/utils/api';
import { useDispatch } from 'react-redux';
import { updateAddress } from '@/state/markersSlice';
import { useCopyLink } from '@/hooks/useCopyLink';
import { concatenateAddress } from '@/utils/concatenateAddress';

type CustomMarkerProps = {
	id: string;
	marker: TMarker;
	position: [number, number];
	icon?: L.Icon;
};

const CustomMarker = ({ id, marker, position, icon }: CustomMarkerProps) => {
	const dispatch = useDispatch();
	const copyLink = useCopyLink();

	const getAddress = async (latitude: number, longitude: number) => {
		const address = await fetchAddress(latitude, longitude);
		return concatenateAddress(address);
	};

	const addMarkerID = (e: LeafletEvent) => {
		const markerElement = e.target.getElement() as HTMLElement;
		markerElement.classList.add('img-' + id);
	};

	const handleClick = (e: LeafletMouseEvent) => {
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
		liItem?.scrollIntoView({
			block: 'center',
			inline: 'center',
			behavior: 'smooth',
		});
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
					position: newPosition,
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
