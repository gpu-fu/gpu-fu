const path = require("path")

module.exports = {
  mode: "production",
  entry: {
    demo1: `./src/demo1`,
    demo2: `./src/demo2`,
    demo3: `./src/demo3`,
    demo4: `./src/demo4`,
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
      {
        test: /\.ts$/,
        use: { loader: "ts-loader", options: { projectReferences: true } },
      },
      { test: /\.wgsl$/, loader: "raw-loader" },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    // liveReload: true,
    liveReload: false,
    compress: true,
    port: 9000,
  },
}
