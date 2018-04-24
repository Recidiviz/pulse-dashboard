import React from 'react';
import ReactDOM from 'react-dom';
import Facts from './Facts';

it('renders the Facts component', () => {
  const div = document.createElement('div');
  const mockData = ['Fact1', 'Fact2', 'Fact3'];
  ReactDOM.render(<Facts data={mockData} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
