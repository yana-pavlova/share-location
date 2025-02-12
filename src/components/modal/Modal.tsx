import { useTranslation } from 'react-i18next';
import styles from './modal.module.scss';

interface ModalProps {
	closeModal: () => void;
}

const Modal = ({ closeModal }: ModalProps) => {
	const { t } = useTranslation();
	const rules = t('rules', { returnObjects: true }) as string[];

	return (
		<>
			<div
				onClick={closeModal}
				className={`${styles.overlay} modal-opened`}
			></div>
			<div className={styles.info}>
				<h2 className={styles.infoTitle}>{t('title')}</h2>
				<ul className={styles.infoItems}>
					{rules.map((rule, index) => (
						<li key={index}>{rule}</li>
					))}
				</ul>
				<button className={styles.closeButton} onClick={closeModal}></button>
			</div>
		</>
	);
};

export default Modal;
