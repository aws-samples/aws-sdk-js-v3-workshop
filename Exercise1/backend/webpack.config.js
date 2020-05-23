/* eslint-disable */

const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entry = glob.sync("./src/*.ts").reduce((acc, item) => {
  const name = item.replace("./src/", "").replace(".ts", "");
  acc[name] = item;
  return acc;
}, {});

module.exports = {
  entry,

  output: {
    filename: "[name]/app.js",
    libraryTarget: "commonjs",
  },

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"],
  },

  // Target node
  target: "node",

  // Set the webpack mode
  mode: process.env.NODE_ENV || "production",

  // Add the TypeScript loader
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnError: true,
        },
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },

  plugins: [new CleanWebpackPlugin()],
};
