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
import PropTypes from 'prop-types';
import HeaderUserInfo from './HeaderUserInfo';

const propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

function Header(props) {
  return (
    <header className="w-100 pa3 ph5-ns bg-white">
      <div className="db dt-ns mw9 center w-100">
        <div className="db dtc-ns v-mid tl w-50">
          <a className="dib f5 f4-ns fw6 mt0 mb1 link black-70" href="/" title="Home">{props.title}</a>
        </div>
        <nav className="db dtc-ns v-mid w-100 tl tr-ns mt2 mt0-ns">
          <HeaderUserInfo user={props.user} />
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;

export default Header;
