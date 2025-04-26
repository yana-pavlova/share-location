import clsx from 'clsx';
import { Copy, Trash2 } from 'lucide-react';
import styles from './Place.module.scss';
import { TMarker } from '../../types';
import { useCopyLink } from '../../hooks/useCopyLink';

interface PlaceProps {
	marker: TMarker;
	onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
	onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Place = ({ marker, onClick, onRemove }: PlaceProps) => {
	const copyLink = useCopyLink();
	const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
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

	const onMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLElement;
		const liElement = target.closest('li');
		liElement?.classList.add('li-highlighted');
		const marker = document.querySelector(
			`.img-${liElement?.id}`
		) as HTMLElement;
		if (marker) marker.style.opacity = '1';
	};

	const onMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLElement;
		const liElement = target.closest('li');
		liElement?.classList.remove('li-highlighted');
		const marker = document.querySelector(
			`.img-${liElement?.id}`
		) as HTMLElement;
		if (marker) marker.style.opacity = '0.5';
	};

	return (
		<li
			id={marker.id}
			data-coords={marker.position.toString()}
			className={clsx(styles.marker, 'li-normal')}
			key={marker.id}
			onClick={onClick}
		>
			<span
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				className={styles.address}
			>
				{marker.text}
			</span>
			<button
				className={`${styles.copyLinkButton} ${styles.button}`}
				onClick={onCopy}
			>
				<Copy size={20} color="#fff" />
				Поделиться
			</button>
			<button
				className={`${styles.removeMarkerButton} ${styles.button}`}
				onClick={onRemove}
			>
				<Trash2 size={20} color="#fff" />
				Удалить
			</button>
		</li>
	);
};
