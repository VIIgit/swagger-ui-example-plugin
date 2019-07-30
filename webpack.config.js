const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");

module.exports = {
  mode: 'production',
  entry: {
    "swagger-ui-plugins.js": glob.sync("build/static/?(js|css)/*.*.?(js|css)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    filename: "public/static/js/swagger-ui-plugins.min.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new UglifyJsPlugin()],
}