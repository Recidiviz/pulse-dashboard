/*
 * Recidiviz - a platform for tracking granular criminal justice metrics in real time
 * Copyright (C) 2018 Recidiviz, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ============================================================================
*/

import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('<App />', () => {
  test('renders a <Sidebar /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('Sidebar').exists()).toBe(true);
  });

  test('renders a <Header /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('Header').exists()).toBe(true);
  });

  test('renders a <KPIsContainer /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('KPIsContainer').exists()).toBe(true);
  });

  test('renders a <ChartsContainer /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('ChartsContainer').exists()).toBe(true);
  });

  test('renders a <Footer /> component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('Footer').exists()).toBe(true);
  });
});
