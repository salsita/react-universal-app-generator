import fs from 'fs';
import webpack from 'webpack';

import buildResolve from './buildResolve';

export default (root, entry) => {
  const resolve = buildResolve(root);

  const nodeModules = fs
    .readdirSync(resolve('./node_modules'))
    .filter(module => ['.bin'].indexOf(module) === -1)
    .reduce((memo, module) => Object.assign({}, memo, {
      [module]: `commonjs ${module}`
    }), {});

  return {
    entry: [
      require.resolve('webpack/hot/poll') + '?1000',
      resolve(entry)
    ],
    target: 'node',
    externals: nodeModules,
    output: {
      path: resolve('./dist'),
      filename: 'server.js'
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
        include: resolve('./')
      }]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
