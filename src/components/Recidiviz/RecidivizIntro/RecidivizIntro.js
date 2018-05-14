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

const propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function RecidivizIntro(props) {
  return props.description.map((paragraph, index) =>
    // While use of dangerouslySetInnerHTML is discouraged, it's safe in this case as we're
    // not handling user input and data is coming from our source code.
    // eslint-disable-next-line no-danger
    <p className="f5 lh-copy mt0 text-our-gray" key={index.toString()} dangerouslySetInnerHTML={{ __html: paragraph }} />);
}

RecidivizIntro.propTypes = propTypes;

export default RecidivizIntro;
