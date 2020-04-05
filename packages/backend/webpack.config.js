/* eslint-disable */
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entryArray = glob.sync("./src/*.ts");

module.exports = {
  entry: entryArray.reduce((acc, item) => {
    const name = item.replace("./src/", "").replace(".ts", "");
    acc[name] = item;
    return acc;
  }, {}),

  output: {
    filename: "[name].js",
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
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json",
            },
          },
        ],
      },
    ],
  },

  plugins: [new CleanWebpackPlugin()],
};
