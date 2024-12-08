import styles from './places.module.scss';
import clsx from 'clsx';
import { TMarker } from '../../types';
import { toast } from 'react-toastify';
import { selectMarkers } from '../../state/markersSlice';
import { useDispatch, useSelector } from 'react-redux';

type PlacesProps = {
	// markers: TMarker[] | [];
	mapRef: React.MutableRefObject<L.Map | null>;
};

const Places = ({ mapRef }: PlacesProps) => {
	const markers = useSelector(selectMarkers);

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
						toast.success('Ссылка скопирована в буфер обмена', {
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
					toast.error('Не удалось скопировать ссылку', {
						autoClose: 1000,
						hideProgressBar: true,
					});
					throw error; // Пробрасываем ошибку дальше
				}
			}

			const res = await toast.promise(
				navigator.clipboard.writeText(textToCopy),
				{
					success: 'Ссылка скопирована в буфер обмена',
					error: 'Не удалось скопировать ссылку',
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

		const marker = markers.find((marker) => {
			return marker.id === target.id;
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
		<ul>
			{markers.map((marker) => {
				return (
					<li
						id={marker.id}
						data-coords={marker.position.toString()}
						className={clsx(styles.marker, 'li-normal')}
						key={marker.id}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onClick={handleLiCLick}
					>
						📍{marker.text}
						<button onClick={handleCopyLinkClick}>🔗</button>
					</li>
				);
			})}
		</ul>
	);
};

export default Places;
