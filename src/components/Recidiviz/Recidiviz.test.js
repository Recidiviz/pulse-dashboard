import React from 'react';
import ReactDOM from 'react-dom';
import Recidiviz from './Recidiviz';

it('renders the Recidiviz component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Recidiviz type="slider" description={['Recidivism slider visualization']} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
