import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('../../lib/static/recidivismSlider.js');
jest.mock('../../lib/static/nlform.js');
jest.mock('../../lib/static/likelihoodSelect.js');

it('renders the App component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
