import styles from './places.module.scss';
import {
	selectMarkers,
	removeMarker,
	removeAllMarkers,
} from '../../state/markersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect, useRef, useState } from 'react';
import { ConfirmationModal } from '../confirmationModal/confirmationModal';
import { Place } from '../place/Place';
import { useTranslation } from 'react-i18next';

type PlacesProps = {
	mapRef: React.MutableRefObject<L.Map | null>;
};

const Places = ({ mapRef }: PlacesProps) => {
	const [isWarningShown, setIsWarningShown] = useState(false);
	const [confirmText, setConfirmText] = useState('');
	const confirmActionRef = useRef<() => void>(() => {});
	const dispatch = useDispatch();
	const markers = useSelector(selectMarkers);
	const listRef = useRef<HTMLUListElement>(null);
	const t = useTranslation().t;

	useLayoutEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	});

	const handleRemoveAllPlaces = () => {
		confirmActionRef.current = () => {
			dispatch(removeAllMarkers());
			setIsWarningShown(false);
		};

		setConfirmText(t('removePlacesWarning'));
		setIsWarningShown(true);
	};

	const handleRemoveMarkerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const target = e.target as HTMLElement;
		const markerEl = target.closest('li');

		if (markerEl?.id) {
			confirmActionRef.current = () => {
				dispatch(removeMarker(markerEl.id));
				setIsWarningShown(false);
			};

			const address = markerEl.querySelector('span')?.textContent;
			setConfirmText(t('removePlaceWarning') + address + '?');
			setIsWarningShown(true);
		} else {
			console.log('marker not found');

			setIsWarningShown(false);
		}
	};

	const handleLiCLick = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLElement;
		const liElement = target.closest('li');

		const marker = markers.find((marker) => {
			return marker.id === liElement?.id;
		});

		if (marker) {
			mapRef.current?.setView(marker.position);
		}
	};

	const handleLiEdit = (e: React.MouseEvent<HTMLButtonElement>) => {};

	return (
		<>
			{markers.length > 1 && (
				<ul ref={listRef} className={styles.list}>
					{markers.map((marker) => {
						return (
							!marker.currentLocation && (
								<Place
									key={marker.id}
									marker={marker}
									onClick={handleLiCLick}
									onRemove={handleRemoveMarkerClick}
									onEdit={handleLiEdit}
								/>
							)
						);
					})}
				</ul>
			)}
			{markers.length > 1 && (
				<button onClick={handleRemoveAllPlaces} className={styles.button}>
					Remove all places
				</button>
			)}

			<ConfirmationModal
				text={confirmText}
				value={isWarningShown}
				onConfirm={confirmActionRef.current}
				onClose={() => setIsWarningShown(false)}
			/>
		</>
	);
};

export default Places;
