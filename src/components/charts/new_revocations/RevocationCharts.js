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

import React, { useState } from "react";
import PropTypes from "prop-types";
import RenderInBrowser from "react-render-in-browser";
import { translate } from "../../../views/tenants/utils/i18nSettings";

const CHARTS = ["District", "Risk level", "Violation", "Gender", "Race"];

const RevocationCharts = ({
  riskLevelChart,
  violationChart,
  genderChart,
  raceChart,
  districtChart,
}) => {
  const [selectedChart, setSelectedChart] = useState(CHARTS[0]);

  // This will ensure that we proactively load each chart component and their data now, but only
  // display the selected chart
  const conditionallyHide = (chart, chartName, chartComponent, index) => (
    <div
      key={index}
      style={{ display: chart === chartName ? "block" : "none" }}
    >
      {chartComponent}
    </div>
  );

  const renderSelectedChartSimultaneousLoad = () => [
    conditionallyHide(selectedChart, "Risk level", riskLevelChart, 0),
    conditionallyHide(selectedChart, "Violation", violationChart, 1),
    conditionallyHide(selectedChart, "Gender", genderChart, 2),
    conditionallyHide(selectedChart, "Race", raceChart, 3),
    conditionallyHide(selectedChart, "District", districtChart, 4),
  ];

  const renderSelectedChartSingularLoad = () => {
    switch (selectedChart) {
      case "Risk level":
        return riskLevelChart;
      case "Violation":
        return violationChart;
      case "Gender":
        return genderChart;
      case "Race":
        return raceChart;
      default:
        return districtChart;
    }
  };

  // IE11 has intermittent issues loading all of these charts simultaneously, most of the time
  // returning errors of "Script7002: XMLHttpRequest: Network Error 0x2eff..."
  // For IE users, we render each chart only when selected.
  // For other users, we render each chart simultaneously so that toggling feels instant.
  const renderSelectedChart = () => (
    <>
      <RenderInBrowser except ie>
        {renderSelectedChartSimultaneousLoad()}
      </RenderInBrowser>

      <RenderInBrowser ie only>
        {renderSelectedChartSingularLoad()}
      </RenderInBrowser>
    </>
  );

  return (
    <div className="RevocationCharts static-charts d-f bgc-white m-20">
      <div className="chart-type-labels p-20">
        {CHARTS.map((chart) => (
          <div key={chart}>
            <button
              type="button"
              className={`chart-type-label ${
                selectedChart === chart ? "selected" : ""
              }`}
              onClick={() => setSelectedChart(chart)}
            >
              {translate(chart)}
            </button>
          </div>
        ))}
      </div>
      <div className="selected-chart p-20">{renderSelectedChart()}</div>
    </div>
  );
};

RevocationCharts.propTypes = {
  riskLevelChart: PropTypes.node.isRequired,
  violationChart: PropTypes.node.isRequired,
  genderChart: PropTypes.node.isRequired,
  raceChart: PropTypes.node.isRequired,
  districtChart: PropTypes.node.isRequired,
};

export default RevocationCharts;
