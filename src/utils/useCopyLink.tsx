import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useCopyLink = (): ((textToCopy: string) => Promise<void>) => {
	const { t } = useTranslation();
	const linkCopied = t('linkCopiedText');
	const linkCopiedErrorText = t('linkCopiedErrorText');

	const copyLink = async (textToCopy: string) => {
		if (!navigator.clipboard || !navigator.clipboard.writeText) return;

		await toast.promise(
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

		return;
	};

	return copyLink;
};
