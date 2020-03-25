import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Home from '../Home';
import { useAuth0 } from '../../react-auth0-spa';

configure({ adapter: new Adapter() });

const user = {
  picture: 'https://ui-avatars.com/api/?name=Demo+Jones&background=0D8ABC&color=fff&rounded=true',
  name: 'Demo Jones',
  email: 'notarealemail@recidiviz.org',
  'https://dashboard.recidiviz.org/app_metadata': {
    state_code: 'RECIDIVIZ',
  },
};

jest.mock('../../react-auth0-spa');

describe('show component Home if isAuthenticated = true', () => {

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
    })
  });

  it('show component if isAuthenticated = true', async() => {
    const wrapper = mount(<Home />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('h2')).toHaveLength(1);
    expect(wrapper.find('h2').text()).toEqual('Dive in on the left');
  });

});

describe ('show component Home if isAuthenticated = false', () => {

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
    })
  });

  it('show component if isAuthenticated = false', async() => {
    const wrapper = mount(<Home />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('h2')).toHaveLength(1);
    expect(wrapper.find('h2').text()).toEqual('Log in to get started');
  });

});