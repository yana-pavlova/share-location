import { useState } from 'react';
import styles from './confirmationModal.module.scss';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
	value: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export const ConfirmationModal = ({
	value,
	onConfirm,
	onClose,
}: ConfirmationModalProps) => {
	const t = useTranslation().t;

	return (
		value && (
			<>
				<div
					onClick={onClose}
					className={`${styles.overlay} modal-opened`}
				></div>
				<div className={styles.modal}>
					<p>{t('removePlacesWarning')}</p>
					<button className={styles.button} onClick={onConfirm}>
						{t('removePlacesButtonText')}
					</button>
				</div>
			</>
		)
	);
};
