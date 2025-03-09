export type TMarker = {
	id: string;
	position: [number, number];
	text: string;
	currentLocation?: boolean;
	highlighted?: boolean;
};

export type TAddress = {
	road?: string;
	suburb?: string;
	city?: string;
	town?: string;
	village?: string;
	city_district?: string;
	state?: string;
	country?: string;
	country_code?: string;
	house_number?: string;
	[key: string]: string | undefined;
};

export type locationText = {
	title: string;
	rules: string[];
	initialPoint: string;
	addPointButton: string;
	footerText: string;
	gettingLocationErrorText: string;
	forbidfLocationErrorText: string;
	locationGeneralErrorText: string;
	locationRequestTimeoutErrorText: string;
	locationUndefinedErrorText: string;
	linkCopiedText: string;
	linkCopiedErrorText: string;
};

export type TSearchAddress = {
	lat: number;
	lon: number;
	display_name: string;
};
