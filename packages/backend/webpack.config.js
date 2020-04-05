/* eslint-disable */
const glob = require("glob");

// Bug https://github.com/webpack/webpack/issues/4453
const entryArray = glob
  .sync("./src/*.ts")
  .map((item) => item.replace("./src/", "").replace(".ts", ""));

module.exports = entryArray.map((name) => ({
  entry: {
    [name]: `./src/${name}.ts`,
  },

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
        exclude: /node_modules/,
      },
    ],
  },
}));
