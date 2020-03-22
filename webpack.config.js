const path = require("path");
const { compact } = require("lodash");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DEBUG = process.env.NODE_ENV !== "production";

module.exports = {
  mode: ["production", "development"][1],
  context: __dirname,
  entry: {
    index: compact([
      path.resolve(__dirname, "index.tsx"),
      DEBUG && "webpack-hot-middleware/client"
    ])
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css"]
  },
  plugins: compact([
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "index.html"),
      inject: false
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: DEBUG ? '"development"' : '"production"'
      }
    }),
    DEBUG && new webpack.HotModuleReplacementPlugin(),
    DEBUG && new webpack.NoEmitOnErrorsPlugin()
  ]),
  devtool: DEBUG && "inline-source-map"
};
