const path = require('path');

module.exports = {
  entry: './src/envs/arcade/snake/SnakeGame.ts',
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
    path: path.resolve(__dirname, 'lib')
  },
  mode: 'development'
};
