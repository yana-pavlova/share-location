import { toast } from 'react-toastify';
import { TAddress } from '../types';
import geoTimeOut from './geoTimeOut';
import { t, NOMINATIM_BASE_URL } from './constants';
import i18n from '../i18n';

export const fetchLocation = async (): Promise<
	{ latitude: number; longitude: number } | undefined
> => {
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
	}
};

interface NominatimResponse {
	address: TAddress;
}

export const fetchAddress = async (
	lat: number,
	lng: number
): Promise<TAddress | null> => {
	try {
		const response = await fetch(
			`${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
		);
		const data: NominatimResponse = await response.json();
		console.log(data);

		return data.address;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const searchAddress = async (
	query: string,
	viewBox?: number[]
): Promise<any> => {
	try {
		const res = await fetch(
			`${NOMINATIM_BASE_URL}/search?format=json&q=${query}&viewbox=${viewBox?.join(',')}`,
			{
				headers: {
					'Accept-Language': i18n.language,
				},
			}
		);
		const data = await res.json();

		return data;
	} catch (err) {
		console.error(err);

		return null;
	}
};
