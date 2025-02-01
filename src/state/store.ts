// TODO: add case ДОБАВИТЬ МАРКЕР

import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markersSlice';

export const store = configureStore({
	reducer: {
		markers: markerReducer,
	},
});

store.subscribe(() => {
	const state = store.getState();
	localStorage.setItem('markers', JSON.stringify(state.markers.markers));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
