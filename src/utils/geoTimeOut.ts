function geoTimeOut(timeoutMs: number): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			reject(new Error('Location request timed out'));
		}, timeoutMs);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				clearTimeout(timeout);
				resolve(position);
			},
			(error) => {
				clearTimeout(timeout);
				reject(error);
			},
			{
				enableHighAccuracy: true,
			}
		);
	});
}

export default geoTimeOut;
