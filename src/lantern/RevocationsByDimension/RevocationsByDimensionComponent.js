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

import "./RevocationsByDimension.scss";

import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import DataSignificanceWarningIcon from "../DataSignificanceWarningIcon";
import ExportMenu from "../ExportMenu";

const RevocationsByDimensionComponent = ({
  chartTitle,
  chartId,
  className,
  datasets,
  labels,
  metricTitle,
  timeDescription,
  chart,
  showWarning,
  modeSwitcher,
  classModifier,
  dataExportLabel,
}) => (
  <div className="RevocationsByDimension">
    <h4 className="RevocationsByDimension__title">
      {chartTitle}
      {showWarning && <DataSignificanceWarningIcon />}
      <ExportMenu
        chartId={chartId}
        datasets={datasets}
        labels={labels}
        metricTitle={metricTitle}
        timeWindowDescription={timeDescription}
        dataExportLabel={dataExportLabel}
      />
    </h4>
    <h6 className="RevocationsByDimension__time">{timeDescription}</h6>
    {modeSwitcher}
    <div
      className={cn("RevocationsByDimension__chart-wrapper", className, {
        [`RevocationsByDimension__chart-wrapper--${classModifier}`]: classModifier,
      })}
    >
      {chart}
    </div>
  </div>
);

RevocationsByDimensionComponent.defaultProps = {
  showWarning: false,
  modeSwitcher: null,
  className: null,
  classModifier: "",
  dataExportLabel: null,
};

RevocationsByDimensionComponent.propTypes = {
  className: PropTypes.string,
  chartTitle: PropTypes.string.isRequired,
  chartId: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      backgroundColor: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
        PropTypes.func,
      ]),
      data: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      ),
    })
  ).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricTitle: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  chart: PropTypes.element.isRequired,
  showWarning: PropTypes.bool,
  modeSwitcher: PropTypes.element,
  classModifier: PropTypes.string,
  dataExportLabel: PropTypes.string,
};

export default RevocationsByDimensionComponent;
