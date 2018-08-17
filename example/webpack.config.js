const path = require('path')

module.exports = {

	entry: "./example/index.js",
	output: {
	    path: path.resolve(__dirname, "build"),
	    publicPath: "/build/",
	    filename: "bundle.js"
	},

	mode: "development",

	module: {

		rules: [

			{
				test: /\.js$/,
				loader: "babel-loader"
			}
		]
	}
}