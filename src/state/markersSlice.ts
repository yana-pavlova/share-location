import { createSlice } from '@reduxjs/toolkit';
import { TMarker } from '../types';

interface TMarkersState {
	markers: TMarker[];
}

const initialState: TMarkersState = {
	markers: [],
};

const markerSlice = createSlice({
	name: 'markers',
	initialState,
	reducers: {
		// добавляем маркер, если маркера с такой же позицией нет в сторе
		// в противном случае возвращаем предыдущее состояние
		addMarker: (state, action) => {
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
		// TODO: типизировать payload
		updateAddress: (state, action) => {
			const markerIndex = state.markers.findIndex(
				(m) => m.id === action.payload.id
			);

			if (markerIndex !== -1) {
				state.markers[markerIndex] = {
					...state.markers[markerIndex],
					position: action.payload.newPosition,
					text: action.payload.text,
				};
			}
		},
	},
});

export default markerSlice.reducer;
export const { addMarker, updateAddress } = markerSlice.actions;

export const selectMarkers = (state: { markers: TMarkersState }) =>
	state.markers.markers;
