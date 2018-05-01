import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';

it('renders the Footer component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Footer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
