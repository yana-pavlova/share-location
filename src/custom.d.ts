// We need to tell TypeScript that when we write "import styles from './styles.scss' we mean to load a module (to look for a './styles.scss.d.ts')

declare module '*.module.css' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.module.scss' {
	const classes: { [key: string]: string };
	export default classes;
}

declare module '*.svg' {
	import * as React from 'react';

	export const ReactComponent: React.FunctionComponent<
		React.SVGProps<SVGSVGElement>
	>;
	const src: string;
	export default src;
}

declare module '*.png' {
	const content: string;
	export default content;
}

// for .env variables
declare namespace NodeJS {
	interface ProcessEnv {
		GOOGLE_MAPS_API_KEY: string;
	}
}
