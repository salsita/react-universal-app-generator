import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { renderToString } from 'react-dom/server';

import buildClientWebpackConfig from './buildClientWebpackConfig';

export default (clientRelativePath, template, renderElement) => {
  const app = express();

  const compiler = webpack(buildClientWebpackConfig(
    process.cwd(),
    clientRelativePath
  ));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
    serverSideRender: true,
    noInfo: true,
    stats: {
      colors: true
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use((req, res) => {
    res.send(template(
      renderToString(renderElement(req)),
      '/client.js'
    ));
  });

  app.listen(3000);
}