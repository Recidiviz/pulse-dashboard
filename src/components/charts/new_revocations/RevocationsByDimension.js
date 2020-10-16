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
import DataSignificanceWarningIcon from "../DataSignificanceWarningIcon";
import ExportMenu from "../ExportMenu";
import { filtersPropTypes } from "../propTypes";

const RevocationsByDimension = ({
  chartTitle,
  chartId,
  datasets,
  labels,
  metricTitle,
  timeDescription,
  filterStates,
  chart,
  showWarning,
  modeSwitcher,
}) => (
  <div>
    <h4>
      {chartTitle}
      {showWarning && <DataSignificanceWarningIcon />}
      <ExportMenu
        chartId={chartId}
        chart={{ props: { data: { datasets, labels } } }}
        metricTitle={metricTitle}
        timeWindowDescription={timeDescription}
        filters={filterStates}
      />
    </h4>
    <h6 className="pB-20">{timeDescription}</h6>
    {modeSwitcher}
    <div className="static-chart-container fs-block">{chart}</div>
  </div>
);

RevocationsByDimension.defaultProps = {
  showWarning: false,
  modeSwitcher: null,
};

RevocationsByDimension.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  chartId: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      backgroundColor: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      data: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricTitle: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  filterStates: filtersPropTypes.isRequired,
  chart: PropTypes.element.isRequired,
  showWarning: PropTypes.bool,
  modeSwitcher: PropTypes.element,
};

export default RevocationsByDimension;
