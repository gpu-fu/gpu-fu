const path = require("path")

module.exports = {
  mode: "production",
  entry: {
    Demo1: `./src/Demo1`,
    Demo2: `./src/Demo2`,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "beta",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.wgsl$/, loader: "raw-loader" },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    liveReload: true,
    compress: true,
    port: 9000,
  },
}
