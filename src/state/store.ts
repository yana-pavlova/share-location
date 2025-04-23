// TODO: limit the number of markers

import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markersSlice';

export const store = configureStore({
	reducer: {
		markers: markerReducer,
	},
});

store.subscribe(() => {
	const state = store.getState();
	const safeMarkers = state.markers.markers.filter(
		(m) =>
			Array.isArray(m.position) &&
			m.position.length === 2 &&
			m.position.every(isFinite)
	);
	localStorage.setItem('markers', JSON.stringify(safeMarkers));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
