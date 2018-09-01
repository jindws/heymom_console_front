const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: {
		app: './src/app.jsx'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath:'crm/',
	},
    resolve: {
        extensions:[".js",".jsx"],
        alias:{
          '@comp': path.resolve(__dirname, './components'),
          '@page': path.resolve(__dirname, './pages'),
          '@modules': path.resolve(__dirname, './modules'),
          '@DB': path.resolve(__dirname, './DB'),
        }
    },
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'react-router-dom': 'ReactRouterDOM',
		echarts:'echarts',
	},
	module: {
		rules: [
			{
				test: /\.js[x]?$/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.(css|scss)/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: 'img/[name].[hash:7].[ext]',
						},
					},
				],
			},
		],
	},
	// webpack 可以监听文件变化，当它们修改后会重新编译。这个页面介绍了如何启用这个功能，以及当 watch 无法正常运行的时候你可以做的一些调整。
	// watch: true,
	watchOptions: {
		ignored: /node_modules/,
	},
	// 会生成.map文件
	// devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
			__LOCAL__: false,
			__TEST__: false,
			__PRO__: true,
		}),
	],
}
