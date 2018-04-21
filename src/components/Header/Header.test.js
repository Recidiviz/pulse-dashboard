import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';

it('renders the Header component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header companyName="Office of Bob Loblaw" contactEmail="bob@lowlaw.com" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
