import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizSlider from './RecidivizSlider';

jest.mock('../../../lib/static/recidivismSlider.js');

it('renders the RecidivizSlider component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizSlider />, div);
  ReactDOM.unmountComponentAtNode(div);
});
