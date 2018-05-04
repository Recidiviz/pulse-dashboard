import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizTable from './RecidivizTable';

jest.mock('../../../lib/static/nlform.js');
jest.mock('../../../lib/static/stateRecidivismRandom.js');

it('renders the RecidivizTable component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
