import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useCopyLink = (): ((
	textToCopy: string
) => Promise<string | void>) => {
	const { t } = useTranslation();
	const linkCopied = t('linkCopiedText');
	const linkCopiedErrorText = t('linkCopiedErrorText');

	const copyLink = async (textToCopy: string) => {
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			const textArea = document.createElement('textarea');
			textArea.value = textToCopy;
			textArea.style.position = 'fixed';
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
					return textToCopy;
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

	return copyLink;
};
