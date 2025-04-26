import clsx from 'clsx';
import { Share, Trash2, Pencil } from 'lucide-react';
import styles from './Place.module.scss';
import { TMarker } from '../../types';
import { useCopyLink } from '../../hooks/useCopyLink';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { editMarkerText } from '../../state/markersSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface PlaceProps {
	marker: TMarker;
	onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
	onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Place = ({ marker, onClick, onRemove }: PlaceProps) => {
	const copyLink = useCopyLink();
	const dispatch = useDispatch();
	const t = useTranslation().t;

	const [startX, setStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [editMode, setEditMode] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState(marker.text);

	const handleClickOutside = () => {
		setCurrentX(0);
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);

		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	useLayoutEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	});

	const onEdit = () => {
		setInputValue(marker.text);
		setEditMode(true);
	};

	const onTouchStart = (e: React.TouchEvent) => {
		setStartX(e.touches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		const deltaX = e.touches[0].clientX - startX;
		if (deltaX < 0) setCurrentX(deltaX);
	};

	const onTouchEnd = () => {
		if (currentX < -50) {
			setCurrentX(-window.innerWidth);
		} else {
			setCurrentX(0);
		}
	};

	const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
		let url = window.location.origin;
		if (url.includes('github')) url += '/share-location';
		const target = e.target as HTMLElement;
		const coords = target.closest('li')?.dataset.coords;

		const lat = coords?.split(',')[0];
		const lng = coords?.split(',')[1];
		const textToCopy = `${url}?lat=${lat}&lng=${lng}`;

		copyLink(textToCopy);

		if (navigator.share) {
			navigator
				.share({
					url: textToCopy,
				})
				.catch(() => copyLink(textToCopy));
		} else {
			copyLink(textToCopy);
		}
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

	const onEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (inputValue.trim() && inputValue.trim() !== marker.text.trim()) {
			dispatch(editMarkerText({ id: marker.id, text: inputValue.trim() }));
		}

		setEditMode(false);
	};

	return (
		<>
			{editMode && (
				<Modal
					closeModal={() => {
						setEditMode(false);
					}}
				>
					<form onSubmit={onEditSubmit} className={styles.form}>
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<button disabled={!inputValue.trim()} type="submit">
							{t('savePlaceButtonText')}
						</button>
					</form>
				</Modal>
			)}
			<li
				id={marker.id}
				data-coords={marker.position.toString()}
				className={clsx(styles.marker, 'li-normal')}
				key={marker.id}
				onClick={onClick}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				style={{ transform: `translateX(${currentX}px)` }}
			>
				<span
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
					className={styles.address}
				>
					{marker.text}
				</span>
				<div className={styles.buttonContainer}>
					<button
						className={`${styles.editLinkButton} ${styles.button}`}
						onClick={onEdit}
					>
						<Pencil size={20} color="#fff" />
						{t('editPlaceButtonText')}
					</button>
					<button
						className={`${styles.copyLinkButton} ${styles.button}`}
						onClick={onCopy}
					>
						<Share size={20} color="#fff" />
						{t('sharePlaceButtonText')}
					</button>
					<button
						className={`${styles.removeMarkerButton} ${styles.button}`}
						onClick={onRemove}
					>
						<Trash2 size={20} color="#fff" />
						{t('removePlacesButtonText')}
					</button>
				</div>
			</li>
		</>
	);
};
