import webpack from 'webpack';

import buildResolve from './buildResolve';

export default (root, entry) => {
  const resolve = buildResolve(root);

  return {
    devtool: 'sourcemap',
    stats: 'error-only',
    entry: [
      require.resolve('webpack-hot-middleware/client'),
      resolve(entry)
    ],
    output: {
      path: '/',
      filename: `/client.js`
    },
    module: {
      loaders: [{
        test: /\.jsx$|\.js$/,
        loader: require.resolve('babel-loader'),
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
            'babel-preset-stage-2'
          ].map(require.resolve)
        },
        include: resolve('../')
      }]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
        'process.env.RUNTIME_ENV': '"client"'
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  }
}