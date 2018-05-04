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

import RecidivizForm from './RecidivizForm';
import RecidivizIntro from './RecidivizIntro';
import RecidivizSlider from './RecidivizSlider';
import RecidivizTable from './RecidivizTable';

const propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const recidivizTypes = {
  slider: RecidivizSlider,
  form: RecidivizForm,
  table: RecidivizTable,
};

function Recidiviz(props) {
  const RecidivizComponent = recidivizTypes[props.type];

  return (
    <section className="bg-black-0125 w-100">
      <article className="bt b--black-10 black-70 bg-our-gray ph3 ph5-ns pv4 pv5-ns">
        <RecidivizIntro description={props.description} />
      </article>
      <RecidivizComponent />
    </section>
  );
}

Recidiviz.propTypes = propTypes;

export default Recidiviz;
