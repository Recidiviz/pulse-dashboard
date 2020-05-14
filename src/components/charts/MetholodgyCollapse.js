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
import PropTypes from "prop-types";

import { toTitleCase } from "../../utils/transforms/labels";

const MetholodgyCollapse = ({ children, chartId }) => {
  const capitalizedChartId = toTitleCase(chartId);
  return (
    <div
      className="layer bdT p-20 w-100 accordion"
      id={`methodology${capitalizedChartId}`}
    >
      <div className="mb-0" id={`methodologyHeading${capitalizedChartId}`}>
        <div className="mb-0">
          <button
            className="btn btn-link collapsed pL-0"
            type="button"
            data-toggle="collapse"
            data-target={`#collapseMethodology${capitalizedChartId}`}
            aria-expanded="true"
            aria-controls={`collapseMethodology${capitalizedChartId}`}
          >
            <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
          </button>
        </div>
      </div>
      <div
        id={`collapseMethodology${capitalizedChartId}`}
        className="collapse"
        aria-labelledby={`methodologyHeading${capitalizedChartId}`}
        data-parent={`#methodology${capitalizedChartId}`}
      >
        {children}
      </div>
    </div>
  );
};

MetholodgyCollapse.propTypes = {
  children: PropTypes.node.isRequired,
  chartId: PropTypes.string.isRequired,
};

export default MetholodgyCollapse;
