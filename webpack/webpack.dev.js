const path = require('path'); //для того чтобы превратить относительный путь в абсолютный, мы будем использовать пакет path
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
		compress: true, // это ускорит загрузку в режиме разработки
		port: 3000,
		open: true, // сайт будет открываться сам при запуске npm run dev
		hot: true,
		https: {
			key: path.resolve(__dirname, 'localhost-key.pem'),
			cert: path.resolve(__dirname, 'localhost.pem'),
		},
	},
	plugins: [
		new ReactRefreshWebpackPlugin(), // Чтобы React не сбрасывал свои состояния при сохранении файлов
	],
};
