const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


function isExternal(module) {
  var context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}


module.exports = {
  js: {
    context: path.resolve(__dirname, 'js'),
    entry: {
      kunai: ['./kunai', './codemirror-themes'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: false,
                }
              },
            ],
          }),
          include: [
            path.resolve(__dirname, 'js'),
            path.resolve(__dirname, 'node_modules'),
          ],
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'expose-loader',
              options: 'Kunai',
            },
            {
              loader: 'babel-loader',
            },
          ],
          include: [
            path.resolve(__dirname, 'js'),
            path.resolve(__dirname, 'node_modules', 'nagato'),
            path.resolve(__dirname, 'node_modules', 'crsearch'),
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(
        ['dist'], { verbose: true, }
      ),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['kunai', 'kunai-vendor'],
        minChunks: function(module) {
          return isExternal(module);
        },
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].css',
        disable: false,
        allChunks: true,
      }),
    ],
  },
  css: {
    context: path.resolve(__dirname, 'css'),
    entry: {
      kunai: './kunai.scss',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'css/[name].css',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            // fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: true,
                }
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
              },
            ],
          }),
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?[hash]',
                publicPath: '../',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'css/[name].css',
        disable: false,
        allChunks: true,
      }),
    ]
  },
};

