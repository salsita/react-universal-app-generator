import React from 'react';
import { server } from 'react-universal-app-generator';

let Application = require('./components/Application').default;

const template = (content, scriptSrc) => `
  <html>
    <head>
      <title>react-universal-app-generator</title>
    </head>
    <body>
      <div id="root">${content}</div>
      <script src="${scriptSrc}"></script>
    </body>
  </html>
`;

server(
  './src/client.js',
  template,
  () =>
    <Application />
);

if (module.hot) {
  module.hot.accept('./components/Application', () => {
    Application = require('./components/Application').default;
  });
}