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
import PropTypes from 'prop-types';

import './Hero.css';

import activateBounce from '../../lib/static/js/letterBounce';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  contactEmail: PropTypes.string.isRequired,
};

class Hero extends Component {
  componentDidMount() {
    activateBounce();
  }

  render() {
    return (
      <main className="demo-moveout">
        <section className="content content--layout">
          <h2 className="word word--moveout">{this.props.title}</h2>
          <h4 className="f3 tc content-center: center">{this.props.description}</h4>
          <div className="flex items-center justify-center pa4 mt6 bg-alert-blue text-our-gray">
            <svg className="w1" data-icon="info" viewBox="0 0 32 32">
              <title>info icon</title>
              <path d="M16 0 A16 16 0 0 1 16 32 A16 16 0 0 1 16 0 M19 15 L13 15 L13 26 L19 26 z M16 6 A3 3 0 0 0 16 12 A3 3 0 0 0 16 6" />
            </svg>
            <span className="lh-title ml3">We&apos;re building some exciting tools in this space; stay tuned. <br /> Meanwhile, play around with existing datasets below or <a href={`mailto:${this.props.contactEmail}`}>contact us.</a></span>
          </div>
        </section>
      </main>
    );
  }
}

Hero.propTypes = propTypes;

export default Hero;
