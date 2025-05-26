// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  // replace active profile with appropriate env for all the variables
  let updatedValue = JSON.stringify(env[next]);
  const toReplace = "\\$\\{active_profile\\}";
  const re = new RegExp(toReplace, "gi"); // "g" for global, "i" for case-insensitive
  updatedValue = updatedValue.replace(re, env.ACTIVE_PROFILE);

  prev[`process.env.${next}`] = updatedValue;
  return prev;
}, {});

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "simplai.chatbot.js",
    path: path.resolve(__dirname, "dist"),
    library: "Chatbot",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        // the order of `use` is important!
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/images",
            },
          },
        ],
      },
    ],
  },
  mode: "production",
  optimization: {
    minimizer: [new TerserJSPlugin({})],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "public" }],
    }),
  ],
  devServer: {
    compress: true,
    port: 3001,
  },
};
