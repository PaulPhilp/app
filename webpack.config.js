var path = require("path");
var webpack = require("webpack");
const Dotenv = require('dotenv-webpack');

module.exports = function(env) {

	let pack = require("./package.json");
	let MiniCssExtractPlugin = require("mini-css-extract-plugin");
	let babelSettings = {
		extends: path.join(__dirname, '/.babelrc')
		};

	let production = !!(env && env.production === "true");
	let asmodule = !!(env && env.module === "true");
	let standalone = !!(env && env.standalone === "true");

	let config = {
		mode: production ? "production" : "development",
		entry: {
			"mainapp" : "./sources/mainapp.ts"
		},
		node: {
			tls: 'empty',
			net: 'empty',
			fs: 'empty',
			har: 'empty',
			async: 'empty',
			child_process: 'empty',
			'tunnel-agent': 'empty',
			'forever-agent': 'empty'
		  },
		output: {
			path: path.join(__dirname, "codebase"),
			publicPath:"/codebase/",
			filename: "[name].js",
			chunkFilename: "[name].bundle.js"
		},
		devtool: "inline-source-map",
		module: {
			rules: [
				/****************
            	 * LOADERS
            	 *****************/
				{
					test: /\.ts$/,
					exclude: [ /node_modules/  ],
					use: 'ts-loader'
				},
				{
					test: /\.js$/,
					exclude: [ /node_modules/ ],
					loader: "babel-loader?" + JSON.stringify(babelSettings)
				},
				{
					test: /\.(svg|png|jpg|gif)$/,
					use: "url-loader?limit=25000"
				},
				{
					test: /\.(less|css)$/,
					use: [ MiniCssExtractPlugin.loader, "css-loader", "less-loader" ]
				},
				/***
				{
					test: /\.(json)$/,
					exclude: [ /node_modules/ ],
					use: ["json-loader" ]
				}
				***/
			]
		},
		resolve: {
			extensions: [".ts", ".js", ".json"],
			modules: ["./sources", "node_modules"],
			alias:{
				//"webix-jet":path.resolve(__dirname, "../webix-jet/dist/"),
				"jet-views":path.resolve(__dirname, "sources/views"),
				"jet-locales":path.resolve(__dirname, "sources/jet-locales"),
			}
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename:"[name].css"
				}),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION : production,
				BUILD_AS_MODULE : (asmodule || standalone)
				}),
			new Dotenv({
				path: path.resolve(__dirname, './.env')
				}),
			],
		//next config is used only by router-url sample
		devServer:{
			historyApiFallback:{
				index : "index.html"
			}
		}
	}

	if (!production){
		config.devtool = "inline-source-map";
		}
	
	if (asmodule){
		if (!standalone){
			config.externals = config.externals || {};
			config.externals = [ "webix-jet" ];
			}

		const out = config.output;
		const sub = standalone ? "full" : "module";

		out.library = pack.name.replace(/[^a-z0-9]/gi, "");
		out.libraryTarget= "umd";
		out.path = path.join(__dirname, "dist", sub);
		out.publicPath = "/dist/"+sub+"/";
		};

	return config;
}