var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./client/src/app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 4 MB
    //   // clientsClaim: true,
    //   // skipWaiting: true,
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        loader: "glslify-import-loader",
      },
      {
        test: /\.(vert|frag)$/i,
        use: "raw-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    client: {
      progress: true,

      reconnect: true,
    },
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 1337,
  },
};
