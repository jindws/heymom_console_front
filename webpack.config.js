const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports  = {
    entry:{
      app:[
        './src/app.jsx'
      ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
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
	// 	react: 'React',
	// 	'react-dom': 'ReactDOM',
	// 	'react-router-dom': 'ReactRouterDOM',
    //     echarts:'echarts',
    //     antd:'antd',
	},
    module: {
        rules: [
            {
                test: /\.(js|jsx)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(css|scss)/,
                use: [
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'postcss-loader'},
                    {loader:'sass-loader'},
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader:'url-loader',
                        options: {
                            limit: 8192,
                            name: 'img/[name].[hash:7].[ext]'
                        }
                    }
                ],
            },
        ]
    },
    watch: true,
    watchOptions:{
        ignored: /node_modules/,
    },
    devServer:{
        proxy: {
            "/crm": {
                target: "http://localhost:6061",
            }
        },
    },
    plugins:[
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: '"development"'
          },
          __LOCAL__:true,
          __PRO__:false,
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
    ]
}
