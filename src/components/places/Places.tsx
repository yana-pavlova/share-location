import styles from './places.module.scss';
import clsx from 'clsx';
import {
	selectMarkers,
	removeMarker,
	removeAllMarkers,
} from '../../state/markersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect, useRef, useState } from 'react';
import { useCopyLink } from '../../hooks/useCopyLink';
import { Trash2, Copy } from 'lucide-react';
import { ConfirmationModal } from '../confirmationModal/confirmationModal';

type PlacesProps = {
	mapRef: React.MutableRefObject<L.Map | null>;
};

const Places = ({ mapRef }: PlacesProps) => {
	const [isWarningShown, setIsWarningShown] = useState(false);
	const confirmActionRef = useRef<() => void>(() => {});
	const dispatch = useDispatch();
	const markers = useSelector(selectMarkers);
	const copyLink = useCopyLink();
	const listRef = useRef<HTMLUListElement>(null);

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

		setIsWarningShown(true);
	};

	const handleRemoveMarkerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const target = e.target as HTMLElement;
		const marker = target.closest('li');

		if (marker?.id) {
			confirmActionRef.current = () => {
				dispatch(removeMarker(marker.id));
				setIsWarningShown(false);
			};

			setIsWarningShown(true);
		} else {
			console.log('marker not found');

			setIsWarningShown(false);
		}
	};

	const handleCopyLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		let url = window.location.origin;
		if (url.includes('github')) url += '/share-location';
		const target = e.target as HTMLElement;
		const coords = target.closest('li')?.dataset.coords;

		const lat = coords?.split(',')[0];
		const lng = coords?.split(',')[1];
		const textToCopy = `${url}?lat=${lat}&lng=${lng}`;

		copyLink(textToCopy);
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

	const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLElement;
		const liElement = target.closest('li');
		liElement?.classList.remove('li-highlighted');
		const marker = document.querySelector(
			`.img-${liElement?.id}`
		) as HTMLElement;
		if (marker) marker.style.opacity = '0.5';
	};

	const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLElement;
		const liElement = target.closest('li');
		liElement?.classList.add('li-highlighted');
		const marker = document.querySelector(
			`.img-${liElement?.id}`
		) as HTMLElement;
		if (marker) marker.style.opacity = '1';
	};

	return (
		<>
			{markers.length > 1 && (
				<ul ref={listRef} className={styles.list}>
					{markers.map((marker) => {
						return (
							!marker.currentLocation && (
								<li
									id={marker.id}
									data-coords={marker.position.toString()}
									className={clsx(styles.marker, 'li-normal')}
									key={marker.id}
									onClick={handleLiCLick}
								>
									<span
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
									>
										{marker.text}
									</span>
									<button
										className={`${styles.copyLinkButton} ${styles.button}`}
										onClick={handleCopyLinkClick}
									>
										<Copy size={20} color="#000" />
									</button>
									<button
										className={`${styles.removeMarkerButton} ${styles.button}`}
										onClick={handleRemoveMarkerClick}
									>
										<Trash2 size={20} color="#000" />
									</button>
								</li>
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
				value={isWarningShown}
				onConfirm={confirmActionRef.current}
				onClose={() => setIsWarningShown(false)}
			/>
		</>
	);
};

export default Places;
