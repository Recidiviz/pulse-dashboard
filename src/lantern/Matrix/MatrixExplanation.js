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
import { translate } from "../../utils/i18nSettings";
import "./MatrixExplanation.scss";

const MatrixExplanation = () => (
  <div className="MatrixExplanation">
    <h4>Using this chart</h4>
    <p className="fw-400">{translate("matrixExplanationP1")}</p>
    <p className="fw-400">{translate("matrixExplanationP2")}</p>
    <div className="d-f mT-20">
      <p className="fs-i fw-600 MatrixExplanation__description">
        Click on a bubble to filter all charts on this dashboard to the group of
        people who are in that bubble. Click the bubble again to undo the
        selection.
      </p>
      <div className="MatrixExplanation__example">
        <div className="MatrixExplanation__example-total">35</div>
      </div>
    </div>
    <div className="d-f mT-20">
      <p className="fs-i fw-600 MatrixExplanation__description">
        Click on a row label to filter all charts on this dashboard to the group
        of people who are in that row. Click the label again to undo the
        selection.
      </p>
      <div className="MatrixExplanation__example">
        <div className="MatrixExplanation__example-violation-type">
          {translate("Technical")}
        </div>
      </div>
    </div>
  </div>
);

export default MatrixExplanation;
