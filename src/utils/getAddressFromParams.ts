import { fetchAddress } from './api';
import { concatenateAddress } from './concatenateAddress';

export const getAddressFromParams = async () => {
	const params = new URLSearchParams(window.location.search);

	const latNum = Number(params.get('lat'));
	const lngNum = Number(params.get('lng'));

	params.delete('lat');
	params.delete('lng');

	const newUrl = window.location.origin + window.location.pathname;
	window.history.replaceState(null, '', newUrl);

	if (isNaN(latNum)) throw new Error('Lat is not a number');
	if (isNaN(lngNum)) throw new Error('Lng is not a number');

	const address = await fetchAddress(latNum, lngNum);
	const addressText = concatenateAddress(address);

	return {
		address: addressText,
		position: [latNum, lngNum],
	};
};
