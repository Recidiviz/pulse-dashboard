import React from 'react';
import ReactDOM from 'react-dom';
import RecidivizIntro from './RecidivizIntro';

it('renders the RecidivizIntro component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RecidivizIntro description={['A fancy picture, so fancy', 'Fancy like Josh']} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
