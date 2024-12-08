import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/App';
import './styles/normalize.css';
import './styles/common.scss';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './state/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
