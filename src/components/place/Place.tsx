import clsx from 'clsx';
import { Copy, Trash2, Pencil } from 'lucide-react';
import styles from './Place.module.scss';
import { TMarker } from '../../types';
import { useCopyLink } from '../../hooks/useCopyLink';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { editMarkerText } from '../../state/markersSlice';
import { useDispatch } from 'react-redux';

interface PlaceProps {
	marker: TMarker;
	onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
	onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Place = ({ marker, onClick, onRemove }: PlaceProps) => {
	const copyLink = useCopyLink();
	const dispatch = useDispatch();

	const [startX, setStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [editMode, setEditMode] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

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

	const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
		const target = e.target as HTMLFormElement;

		const text = target.querySelector('input')?.value;

		if (text && text !== marker.text) {
			dispatch(editMarkerText({ id: marker.id, text }));
		}

		setEditMode(false);
	};

	return (
		<>
			{editMode && (
				<Modal closeModal={() => setEditMode(false)}>
					<form onSubmit={onEditSubmit} className={styles.form}>
						<input ref={inputRef} type="text" defaultValue={marker.text} />
						<button type="submit">Сохранить</button>
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
						Редактировать
					</button>
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
				</div>
			</li>
		</>
	);
};
