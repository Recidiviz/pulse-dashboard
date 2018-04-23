import React from 'react';
import ReactDOM from 'react-dom';
import Hero from './Hero';

it('renders the Hero component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hero title="Office of Bob Loblaw" description="No doubletalk from Bob Loblaw" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
