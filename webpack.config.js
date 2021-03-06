module.exports = {
  entry: "./lib/entry.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  module: {
  loaders: [
    {
      test: [/\.js?$/],
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }
  ]
},
  devtool: 'source-map',
  resolve: {
    extensions: ["",".js"]
  }
};
