/* eslint no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const str = 'ES6';
console.log('Successfully loaded from bundle.');
console.log(`Successfully compiled ${str}`);

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
