import { toast } from 'react-toastify';
import { TAddress } from '../types';
import geoTimeOut from './geoTimeOut';

export const fetchLocation = async (): Promise<
	{ latitude: number; longitude: number } | undefined
> => {
	let loadingToastId;

	loadingToastId = toast.loading('Getting your location...', {
		autoClose: 3000,
	});

	try {
		const position = await geoTimeOut(5000);
		const { latitude, longitude } = position.coords;

		return { latitude, longitude };
	} catch (err: any) {
		if (err.code === 1) {
			toast.error(
				'Please, enable geolocation on your device or browser. Then try again'
			);
		} else if (err.code === 2) {
			toast.error(
				'Unfortunately, we could not get your location. Please, try again'
			);
		} else if (err.code === 3) {
			toast.error('Location request timed out. Please, try again');
		} else {
			toast.error(`Something went wrong. Please, try again`, {
				hideProgressBar: true,
				autoClose: 3000,
			});
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
