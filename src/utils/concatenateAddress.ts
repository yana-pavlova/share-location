import { TAddress } from '../types';
import { t } from './constants';

export const concatenateAddress = (address: TAddress | null) => {
	if (address === null) return t('unknownAddress');

	const addressText = [
		address?.city ||
			address?.town ||
			address?.village ||
			address?.hamlet ||
			address?.municipality,
		address?.road,
		address?.house_number,
	]
		.filter(Boolean)
		.join(', ');

	return addressText.length > 0 ? addressText : t('unknownAddress');
};
