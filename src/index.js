import React from 'react';
import ReactDOM from 'react-dom';

import 'tachyons/css/tachyons.css';
import 'typeface-nunito/index.css';
import 'typeface-squada-one/index.css';

// TODO: All of these CSS files should be removed as components are refactored
// import '../css/columns.css';
// import '../css/component.css';
// import '../css/default.css';
// import '../css/demo.css';
// TODO: This is needed for Hero and should be moved there
import '../css/moveout.css';
// import '../css/normalize.css';
// import '../css/recidiviz.css';

import App from './components/App';

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
