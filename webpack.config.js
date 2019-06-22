const path = require('path');

module.exports = {
  // Change the entry point to run a different environment
  entry: './src/envs/text/FrozenLake.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'var',
    library: 'Env'
  },
  mode: 'development'
};
