import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizTable from './RecidivizTable';

it('renders the RecidivizTable component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
