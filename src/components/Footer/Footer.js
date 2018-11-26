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

import { Organization } from '../../config/constants';

function Footer() {
  return (
    <footer className="bg-white ph4 pv4 bt b--black-10">
      <p className="f6 f5-ns lh-copy text-our-gray">
        For feedback or questions, reach out to us at <a href="mailto:{Organization.primaryContact}?Subject=Recidiviz%20Feedback">{Organization.primaryContact}</a>
      </p>
    </footer>
  );
}

export default Footer;
