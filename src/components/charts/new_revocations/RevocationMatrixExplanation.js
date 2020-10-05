// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import React from "react";

const RevocationMatrixExplanation = () => (
  <div className="RevocationMatrixExplanation bgc-white p-20">
    <h4>Using this chart</h4>
    <p className="fw-300">
      This chart plots all people who were revoked to prison during the selected
      time period, according to their most serious violation and the total
      number of violation reports and notices of citation that were filed within
      one year prior to the last reported violation before the person was
      revoked. (See methodology for more details.)
    </p>
    <p className="fw-300">
      The numbers inside the bubbles represent the number of people who were
      revoked, whose most serious violation matches the violation at the head of
      that row, and who have the number of prior violations at the head of that
      column.
    </p>
    <div className="d-f mT-20">
      <div className="example-icon-container">
        <div className="example-violation-total">35</div>
      </div>
      <p className="fs-i fw-600">
        Click on a bubble to filter all charts on this dashboard to the group of
        people who are in that bubble. Click the bubble again to undo the
        selection.
      </p>
    </div>
    <div className="d-f mT-20">
      <div className="example-icon-container">
        <div className="example-violation-type">Technical</div>
      </div>
      <p className="fs-i fw-600">
        Click on a row label to filter all charts on this dashboard to the group
        of people who are in that row. Click the label again to undo the
        selection.
      </p>
    </div>
  </div>
);

export default RevocationMatrixExplanation;
