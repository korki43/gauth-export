const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (_env, args) => {
  const IS_DEV = args.mode != 'production';
  console.log(`Building in ${IS_DEV ? 'development' : 'production'} mode`);
  return {
    entry: './src/index.ts',
    devtool: IS_DEV ? 'source-map' : false,
    mode: IS_DEV ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      port: 3000,
      hot: false,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'public/styles.css',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve('./public/index.html'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: 'public',
            filter: (path) => !path.endsWith('.html'),
          },
        ],
      }),
      new DefinePlugin({
        IS_DEV,
      }),
    ],
  };
};
