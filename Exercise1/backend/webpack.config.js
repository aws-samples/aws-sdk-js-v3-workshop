/* eslint-disable */

const AwsSamPlugin = require("aws-sam-webpack-plugin");
const path = require("path");

const awsSamPlugin = new AwsSamPlugin({ vscodeDebug: false });

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // template.yaml or template.yml
  entry: awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: "[name]/app.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, ".aws-sam/build/")
  },

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"]
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
          failOnError: true
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin]
};
