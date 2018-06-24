var nodeExternals = require('webpack-node-externals');
var PathOverridePlugin = require('path-override-webpack-plugin');
var path = require('path');

module.exports = {

  target: 'node',

  entry: {
    "XMLHttpRequest.test": path.resolve(__dirname, "test/unit_test/XMLHttpRequest.test"),
  },

  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "./dist/test/unit_test"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].js", // string    // the filename template for entry chunks

    publicPath: "/assets/", // string    // the url to the output directory resolved relative to the HTML page

  },

  plugins: [
    new PathOverridePlugin(/^.*\/web\-base/, path.resolve(__dirname, "test/mock/web-base")),
  ],

  externals: [nodeExternals()]

};