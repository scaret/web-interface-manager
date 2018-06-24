var path = require('path');

module.exports = {

  entry: {
    "InterfaceManager": path.resolve(__dirname, "index.js"),
  },

  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "./dist/"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name].js", // string    // the filename template for entry chunks

    library: "[name]", // string,
    // the name of the exported library
    libraryTarget: "umd", // universal module definition

  },

  devtool: "source-map", // enum
};