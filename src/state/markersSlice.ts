import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TMarker } from '../types';

interface TMarkersState {
	markers: TMarker[];
}

const loadState = (): TMarker[] | undefined => {
	// забираем данные из локального хранилища, если они там есть
	try {
		const serializedState = localStorage.getItem('markers');
		if (serializedState === null) return undefined;

		const safeSerializedState = JSON.parse(serializedState).filter(
			(m: TMarker) =>
				Array.isArray(m.position) &&
				m.position.length === 2 &&
				m.position.every(isFinite)
		);

		return safeSerializedState;
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

const initialState: TMarkersState = {
	markers: loadState() || [],
};

const markerSlice = createSlice({
	name: 'markers',
	initialState,
	reducers: {
		// добавляем маркер, если маркера с такой же позицией нет в сторе
		// в противном случае возвращаем предыдущее состояние
		addMarker: (state, action: PayloadAction<TMarker>) => {
			const markerExists = state.markers.some((m) => {
				return (
					m.position[0] === action.payload.position[0] &&
					m.position[1] === action.payload.position[1]
				);
			});

			if (!markerExists) {
				state.markers.push(action.payload);
			}
		},
		editMarkerText: (
			state,
			action: PayloadAction<{ id: string; text: string }>
		) => {
			const target = state.markers.find((m) => m.id === action.payload.id);

			if (target) {
				target.text = action.payload.text;
			}
		},
		removeMarker: (state, action: PayloadAction<string>) => {
			state.markers = state.markers.filter((m) => m.id !== action.payload);
		},
		removeAllMarkers: (state) => {
			state.markers = state.markers.filter((m) => m.currentLocation);
		},
		addCurrentLocation: (state, action: PayloadAction<TMarker>) => {
			const markerIndex = state.markers.findIndex((m) => m.currentLocation);

			if (markerIndex !== -1) {
				state.markers[markerIndex] = {
					...state.markers[markerIndex],
					position: action.payload.position,
				};
			} else {
				state.markers.push({
					...action.payload,
					currentLocation: true,
				});
			}
		},
		// TODO remove updateCurrentLocation
		updateCurrentLocation: (state, action: PayloadAction<string>) => {
			const markerIndex = state.markers.findIndex((m) => m.currentLocation);

			if (markerIndex !== -1) {
				state.markers[markerIndex] = {
					...state.markers[markerIndex],
					text: action.payload,
				};
			}
		},
		updateAddress: (
			state,
			action: PayloadAction<Pick<TMarker, 'id' | 'position' | 'text'>>
		) => {
			const markerIndex = state.markers.findIndex(
				(m) => m.id === action.payload.id
			);

			if (markerIndex !== -1) {
				state.markers[markerIndex] = {
					...state.markers[markerIndex],
					position: action.payload.position,
					text: action.payload.text,
				};
			}
		},
	},
});

export default markerSlice.reducer;
export const {
	addMarker,
	editMarkerText,
	removeMarker,
	removeAllMarkers,
	addCurrentLocation,
	updateAddress,
	updateCurrentLocation,
} = markerSlice.actions;

export const selectMarkers = (state: { markers: TMarkersState }) =>
	state.markers.markers;

export const selectCurrentLocation = (state: { markers: TMarkersState }) =>
	state.markers.markers.find((m) => m.currentLocation)?.position;
