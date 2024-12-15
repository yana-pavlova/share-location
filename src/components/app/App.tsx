import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import MyMap from '../map/Map';
import Places from '../places/Places';
import L from 'leaflet';
import { fetchLocation, fetchAddress } from '../../utils/api';
import { useDispatch } from 'react-redux';
import {
	addCurrentLocation,
	addMarker,
	updateCurrentLocation,
} from '../../state/markersSlice';
import styles from './app.module.scss';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const App = () => {
	const dispatch = useDispatch();

	// currentLocation is the user's location
	const [currentLocation, setCurrentLocation] = useState<null | {
		latitude: number;
		longitude: number;
	}>(null);
	// location is the map center
	const [location, setLocation] = useState<{
		latitude: number;
		longitude: number;
	}>({ latitude: 51.505, longitude: -0.09 });
	const [curLocationIsloading, setCurLocationIsloading] =
		useState<boolean>(false);
	const mapRef = useRef<L.Map | null>(null);
	const { t } = useTranslation();
	const rules = t('rules', { returnObjects: true }) as string[];
	const initialPointText = t('initialPoint');

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const lat = params.get('lat');
		const lng = params.get('lng');

		const getAddress = async () => {
			if (lat && lng) {
				const address = await fetchAddress(+lat, +lng);
				const addressText = [
					address?.country,
					address?.city,
					address?.town,
					address?.village,
					address?.road,
					address?.house_number,
					address?.hamlet,
				]
					.filter(Boolean) // get rid of falsy values
					.join(', ');

				const newMarker = {
					id: uuidv4(),
					highlighted: false,
					text: addressText || '',
					position: [+lat, +lng] as [number, number],
				};
				dispatch(addMarker(newMarker));
				setLocation({ latitude: +lat, longitude: +lng });
			}
		};

		const getLocation = async () => {
			setCurLocationIsloading(true);
			const coords = await fetchLocation();
			setCurLocationIsloading(false);

			if (coords) {
				setCurrentLocation({
					latitude: coords.latitude,
					longitude: coords.longitude,
				});
				setLocation({ latitude: coords.latitude, longitude: coords.longitude });
			}
		};

		// if we have lat and lng in url, we show the marker based on them
		if (lat && lng) {
			getAddress();
			// if we don't have lat and lng in url, we show the user's location by default
		} else {
			getLocation();
		}
	}, []);

	useEffect(() => {
		if (currentLocation) {
			const newMarker = {
				id: uuidv4(),
				highlighted: false,
				text: initialPointText,
				position: [currentLocation.latitude, currentLocation.longitude] as [
					number,
					number
				],
				currentLocation: true,
			};
			dispatch(addCurrentLocation(newMarker));
			return;
		}
	}, [currentLocation]);

	useEffect(() => {
		dispatch(updateCurrentLocation(initialPointText));
	}, [i18next.language]);

	return (
		<>
			<Header />
			{curLocationIsloading ? (
				<p>Loading...</p>
			) : (
				<main className={styles.container}>
					<ToastContainer />
					<Places mapRef={mapRef} />
					<MyMap
						mapRef={mapRef}
						location={location}
						//? put currentLocation into contextProvider
						currentLocation={currentLocation}
						setCurrentLocation={setCurrentLocation}
					/>
					<div className={styles.info}>
						<h2 className={styles.infoTitle}>{t('title')}</h2>
						<ul className={styles.infoItems}>
							{rules.map((rule, index) => (
								<li key={index}>{rule}</li>
							))}
						</ul>
					</div>
				</main>
			)}
			<Footer />
		</>
	);
};

export default App;
