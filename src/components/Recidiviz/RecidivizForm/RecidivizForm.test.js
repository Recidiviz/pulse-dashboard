import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizForm from './RecidivizForm';

jest.mock('../../../lib/static/nlform.js');
jest.mock('../../../lib/static/likelihoodSelect.js');

it('renders the RecidivizForm component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
