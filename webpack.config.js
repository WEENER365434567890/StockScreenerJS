// webpack.config.js
const Dotenv = require('dotenv-webpack');
const path = require('path');
require('dotenv').config({ path: './.env' }); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); 
const config = {
  entry: [
    path.resolve(__dirname, 'src', 'index.js'),
    path.resolve(__dirname, 'src', 'main.css')
  ],
  output: {
    path: path.join(__dirname, 'dist'), // bundled file in dist/
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // applies to js files
        use: ['babel-loader'], // transpiles your js
        exclude: /node_modules/, // don't transpile node modules
      },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },


      {
        test: /\.s?[ac]ss$/, // applies to css/scss/sass files
        use: [
          MiniCssExtractPlugin.loader, // create bundled css file
          {
            loader: 'css-loader', // resolves @import statements
            options: { url: false } // don't resolve url() statements
          },
          'sass-loader', // compiles sass to css
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin(),new webpack.DefinePlugin({
    "process.env": JSON.stringify(process.env)
  }),],
  
  
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  return config;
}