import React from 'react';
import { render } from 'react-dom';

const doRender = () =>  {
  const Application = require('./components/Application').default;
  render(<Application />, document.getElementById('root'));
};

doRender();

if (module.hot) {
  module.hot.accept('./components/Application', doRender);
}
