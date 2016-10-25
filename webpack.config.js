var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
	entry: {
		website: ['babel-polyfill', 'whatwg-fetch', './src/index.js']
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]-[hash].js',
		libraryTarget: 'umd',
		publicPath: '/'
	},
	devServer: {
		hot: true,
		stats: {
			colors: true
		},
		progress: true,
		historyApiFallback: true// 404s will return index.html in webpack dev server
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Alex Lockhart',
			template: 'template/index.html'
		}),
		new FaviconsWebpackPlugin('./src/img/favicon.png'),
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react', 'stage-0']
			}
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.scss$/,
			loaders: ['style', 'css', 'resolve-url', 'sass'] // sass -> css -> javascript -> inline style
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg)$/,
			loader: 'url-loader?limit=100000'
		}, {
			test: /\.js$/,
			loader: 'eslint-loader',
			exclude: /node_modules/
		}]
	},
	eslint: {
		failOnError: true
	}
};
