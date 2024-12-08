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
