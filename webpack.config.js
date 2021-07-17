const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src/app/background.js'),
    options: path.resolve(__dirname, 'src/app/options.js'),
    popup: path.resolve(__dirname, 'src/app/popup.js'),
    main: path.resolve(__dirname, 'src/app/main.js')
  },

  output: {
    path: path.resolve(__dirname, 'extension/dist'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.json', '.less', '.css'],
    alias: {
      utils: path.resolve(__dirname, 'src/app/utils'),
      images: path.resolve(__dirname, 'src/images'),
      styles: path.resolve(__dirname, 'src/styles')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loaders: ['html-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader"
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/views/options.html'),
      filename: 'options.html',
      chunks: ['options'],
      inject: true,
      minify: {}
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/views/popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      inject: true,
      minify: {}
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  devtool: 'eval-cheap-module-source-map'
}
