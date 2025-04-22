import styles from './places.module.scss';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import {
	selectMarkers,
	removeMarker,
	removeAllMarkers,
} from '../../state/markersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useRef } from 'react';

type PlacesProps = {
	mapRef: React.MutableRefObject<L.Map | null>;
};

const Places = ({ mapRef }: PlacesProps) => {
	const dispatch = useDispatch();
	const markers = useSelector(selectMarkers);

	const { t } = useTranslation();
	const linkCopied = t('linkCopiedText');
	const linkCopiedErrorText = t('linkCopiedErrorText');

	const listRef = useRef<HTMLUListElement>(null);
	useLayoutEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	});

	const handleRemoveAllPlaces = () => {
		dispatch(removeAllMarkers());
	};

	const handleRemoveMarkerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const target = e.target as HTMLElement;
		const marker = target.closest('li');

		if (marker?.id) {
			dispatch(removeMarker(marker.id));
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

		const copyLink = async () => {
			if (!navigator.clipboard || !navigator.clipboard.writeText) {
				const textArea = document.createElement('textarea');
				textArea.value = textToCopy;
				textArea.style.position = 'fixed'; // Чтобы избежать прокрутки страницы
				textArea.style.opacity = '0';
				document.body.appendChild(textArea);
				textArea.select();

				try {
					const success = document.execCommand('copy');
					document.body.removeChild(textArea);

					if (success) {
						toast.success(linkCopied, {
							autoClose: 1000,
							hideProgressBar: true,
						});
						return textToCopy; // Возвращаем текст
					} else {
						throw new Error('document.execCommand не удалось');
					}
				} catch (error) {
					document.body.removeChild(textArea);
					console.error('Ошибка копирования через fallback:', error);
					toast.error(linkCopied, {
						autoClose: 1000,
						hideProgressBar: true,
					});
					throw error;
				}
			}

			const res = await toast.promise(
				navigator.clipboard.writeText(textToCopy),
				{
					success: linkCopied,
					error: linkCopiedErrorText,
				},
				{
					autoClose: 1000,
					hideProgressBar: true,
				}
			);

			return res;
		};

		copyLink();
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
			<button onClick={handleRemoveAllPlaces} className={styles.button}>
				Remove all places
			</button>
			<ul ref={listRef} className={styles.list}>
				{markers.map((marker) => {
					return (
						<li
							id={marker.id}
							data-coords={marker.position.toString()}
							className={clsx(styles.marker, 'li-normal')}
							key={marker.id}
							onClick={handleLiCLick}
						>
							<button
								className={`${styles.copyLinkButton} ${styles.button}`}
								onClick={handleCopyLinkClick}
							>
								🔗
							</button>
							<button
								className={`${styles.removeMarkerButton} ${styles.button}`}
								onClick={handleRemoveMarkerClick}
							>
								❌
							</button>
							<span
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								{marker.text}
							</span>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default Places;
