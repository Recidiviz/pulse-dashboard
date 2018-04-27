import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizSlider from './RecidivizSlider';

it('renders the RecidivizSlider component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizSlider />, div);
  ReactDOM.unmountComponentAtNode(div);
});
