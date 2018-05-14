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

import React, { Component } from 'react';

import '../../../lib/static/css/slider.css';
import addRecidivismSlider from '../../../lib/static/js/recidivismSlider';

class RecidivizSlider extends Component {
  componentDidMount() {
    addRecidivismSlider();
  }

  render() {
    return (
      <article className="bt b--black-10 black-70 ph3 ph5-ns pt2 pt3-ns">
        <div className="mw9 center pa3 pa5-ns flex flex-column items-center" id="first-chart">
          <div className="w-75">
            <h1 className="tc f5 fw6 f2-ns lh-title measure text-our-gray">
              If 100 people were released from prison today...
            </h1>
          </div>
          <div className="w-75">
            <h1 className="f5 fw6 f2-ns tc text-our-gray" id="sliderLabel">
                (drag the slider)
            </h1>
          </div>
        </div>
      </article>
    );
  }
}

export default RecidivizSlider;
