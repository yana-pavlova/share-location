import { toast } from 'react-toastify';
import { TAddress } from '../types';
import geoTimeOut from './geoTimeOut';
import { t } from './constants';

export const fetchLocation = async (): Promise<
	{ latitude: number; longitude: number } | undefined
> => {
	let loadingToastId;

	try {
		const position = await geoTimeOut(5000);
		const { latitude, longitude } = position.coords;

		return { latitude, longitude };
	} catch (err: any) {
		if (err.code === 1) {
			toast.error(t('forbidfLocationErrorText'));
		} else if (err.code === 2) {
			toast.error(t('locationGeneralErrorText'));
		} else if (err.code === 3) {
			toast.error(t('locationRequestTimeoutErrorText'));
		} else {
			toast.error(t('locationUndefinedErrorText'));
		}
		return undefined;
	} finally {
		if (loadingToastId) {
			toast.dismiss(loadingToastId);
		}
	}
};

export const fetchAddress = async (
	lat: number,
	lng: number
): Promise<TAddress | null> => {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
	);
	const data = await response.json();
	return data.address;
};

export const searchAddress = async (query: string): Promise<any> => {
	const res = await fetch(
		'https://nominatim.openstreetmap.org/search?format=json&q=' + query
	);
	const data = await res.json();

	return data;
};
