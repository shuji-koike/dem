const path = require("path");
const webpack = require("webpack");

const DEBUG = process.env.NODE_ENV !== "production";

module.exports = {
  mode: ["production", "development"][1],
  entry: {
    index: [
      path.resolve(__dirname, "src/index.tsx"),
      DEBUG && "webpack-hot-middleware/client"
    ].filter(e => e)
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"]
  },
  plugins: [
    new (require("html-webpack-plugin"))({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
      inject: false
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: process.env.NODE_ENV || '"development"'
      }
    }),
    DEBUG && new webpack.HotModuleReplacementPlugin(),
    DEBUG && new webpack.NoEmitOnErrorsPlugin()
  ].filter(e => e),
  devtool: DEBUG && "inline-source-map"
};
