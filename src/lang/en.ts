import { locationText } from '../types';

export const engText: locationText = {
	title: 'How to use the app',
	rules: [
		'Click on the arrow to define your location',
		'Click on the map to add a new address',
		'Drag the marker to give it a new location. You current location marker (a red one) is undraggable',
		'Click on the marker to copy the link to it',
		'Paste the copied link in a browser to open the map with the respective address',
		'Click on the bin icon near the address to remove it',
	],
	initialPoint: "You're here",
	addPointButton: 'Click to create a map point',
	footerText: 'If you notice any bugs, please, report them on ',
	gettingLocationErrorText: 'Getting your location...',
	forbidfLocationErrorText:
		'Please, enable geolocation on your device or browser. Then try again',
	locationGeneralErrorText:
		'Unfortunately, we could not get your location. Please, try again',
	locationRequestTimeoutErrorText:
		'Location request timed out. Please, try again',
	locationUndefinedErrorText: 'Something went wrong. Please, try again',
	linkCopiedText: 'Link copied to clipboard',
	linkCopiedErrorText: 'Something went wrong. Please, try again',
	removePlacesWarning: 'Are you sure? This cannot be undone',
	removePlacesButtonText: 'Remove',
};
