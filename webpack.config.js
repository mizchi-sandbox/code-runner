const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  entry: [__dirname + "/src/main"],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { transpileOnly: true }
      }
    ]
  },
  node: {
    fs: "empty",
    net: "empty",
    module: "empty"
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["typescript", "json"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ]
};
