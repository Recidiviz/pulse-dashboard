// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import React from 'react';
import ReactTooltip from 'react-tooltip'

const WarningIcon = () => (
  <>
    {' '}
    <span data-tip data-for="warningTooltip" className="ti-alert" />
    <ReactTooltip id="warningTooltip">
      Some categories in this chart may not be statistically significant <br />
      due to having a sample size smaller than 100. <br />
      Those categories are represented with line shading.
    </ReactTooltip>
  </>
)

export default WarningIcon;