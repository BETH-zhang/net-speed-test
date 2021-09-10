var path = require('path');
var version = require('./package.json').version;
var webpack = require('webpack');

module.exports = {
	entry: {
		netSpeedTest: './src/index.js'
	},
	output: {
		path: __dirname + '/build',
		filename: '[name].js',
		library: 'netSpeedTest',
		libraryTarget: 'umd'
	},
	plugins: [
		new webpack.DefinePlugin({
			__VERSION__: JSON.stringify(version)
		})
	]
};