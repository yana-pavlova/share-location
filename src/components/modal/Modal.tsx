import { useTranslation } from 'react-i18next';
import styles from './modal.module.scss';
import { useEffect } from 'react';

interface ModalProps {
	closeModal: () => void;
	children?: React.ReactNode;
}

const Modal = ({ closeModal, children }: ModalProps) => {
	const { t } = useTranslation();
	const rules = t('rules', { returnObjects: true }) as string[];

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeModal();
			}
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	return (
		<>
			<div
				onClick={closeModal}
				className={`${styles.overlay} modal-opened`}
			></div>
			{children ? (
				<div className={styles.info}>
					<h2 className={styles.infoTitle}>{t('editFormTitle')}</h2>
					{children}
				</div>
			) : (
				<div className={styles.info}>
					<h2 className={styles.infoTitle}>{t('title')}</h2>
					<ul className={styles.infoItems}>
						{rules.map((rule, index) => (
							<li key={index}>{rule}</li>
						))}
					</ul>
					<button className={styles.closeButton} onClick={closeModal}></button>
				</div>
			)}
		</>
	);
};

export default Modal;
