import L, { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { Marker, useMap } from 'react-leaflet';
import { TMarker } from '@/types';
import { fetchAddress } from '@/utils/api';
import { useDispatch } from 'react-redux';
import { updateAddress } from '@/state/markersSlice';
import { useCopyLink } from '@/hooks/useCopyLink';
import { concatenateAddress } from '@/utils/concatenateAddress';
import { useRef } from 'react';

type CustomMarkerProps = {
	id: string;
	marker: TMarker;
	position: [number, number];
	icon?: L.Icon;
};

const CustomMarker = ({ id, marker, position, icon }: CustomMarkerProps) => {
	const dispatch = useDispatch();
	const copyLink = useCopyLink();
	const map = useMap();
	const tooltipRef = useRef<L.Tooltip | null>(null);

	const getAddress = async (latitude: number, longitude: number) => {
		const address = await fetchAddress(latitude, longitude);
		return concatenateAddress(address);
	};

	const addMarkerID = (e: LeafletEvent) => {
		const markerElement = e.target.getElement() as HTMLElement;
		markerElement.classList.add('img-' + id);
		markerElement.dataset.coords = marker.position.join(',');
		markerElement.dataset.address = marker.text;
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

		const markerElement = e.target.getElement() as HTMLElement;

		const tooltip = L.tooltip({
			permanent: false,
			direction: 'top',
			offset: [0, -20],
		})
			.setContent(markerElement.dataset.address ?? '')
			.setLatLng(e.latlng);

		map.openTooltip(tooltip);
		tooltipRef.current = tooltip;
	};

	const handleMouseOut = (e: LeafletMouseEvent) => {
		e.target.setOpacity(0.5);
		const liItem = document.getElementById(id);
		liItem?.classList.remove('li-highlighted');

		if (tooltipRef.current) {
			e.target._map.closeTooltip(tooltipRef.current);
			tooltipRef.current = null;
		}
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
			{...(icon ? { icon: icon } : {})}
		/>
	);
};

export default CustomMarker;
