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
import cn from "classnames";
import PropTypes from "prop-types";
import RenderInBrowser from "react-render-in-browser";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import "./RevocationCharts.scss";

// prettier-ignore
const CHARTS = ["District", "Agent", "Risk level", "Violation", "Gender", "Race"];

const RevocationCharts = ({
  riskLevelChart,
  agentChart,
  violationChart,
  genderChart,
  raceChart,
  districtChart,
}) => {
  const [selectedChart, setSelectedChart] = useState(CHARTS[0]);

  // This will ensure that we proactively load each chart component and their data now, but only
  // display the selected chart
  const conditionallyHide = (chart, chartName, chartComponent) => (
    <div
      key={chartName}
      className={cn("RevocationCharts__chart", {
        "RevocationCharts__chart--selected": chart === chartName,
      })}
    >
      {chartComponent}
    </div>
  );

  const renderSelectedChartSimultaneousLoad = () => [
    conditionallyHide(selectedChart, "Risk level", riskLevelChart),
    conditionallyHide(selectedChart, "Agent", agentChart),
    conditionallyHide(selectedChart, "Violation", violationChart),
    conditionallyHide(selectedChart, "Gender", genderChart),
    conditionallyHide(selectedChart, "Race", raceChart),
    conditionallyHide(selectedChart, "District", districtChart),
  ];

  const renderSelectedChartSingularLoad = () => {
    switch (selectedChart) {
      case "Risk level":
        return riskLevelChart;
      case "Agent":
        return agentChart;
      case "Violation":
        return violationChart;
      case "Gender":
        return genderChart;
      case "Race":
        return raceChart;
      case "District":
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
    <div className="RevocationCharts">
      <div className="RevocationCharts__labels">
        {CHARTS.map((chart) => (
          <div className="RevocationCharts__label" key={chart}>
            <button
              type="button"
              className={cn("RevocationCharts__button", {
                "RevocationCharts__button--selected": selectedChart === chart,
              })}
              onClick={() => setSelectedChart(chart)}
            >
              {translate(chart)}
            </button>
          </div>
        ))}
      </div>
      {renderSelectedChart()}
    </div>
  );
};

RevocationCharts.propTypes = {
  riskLevelChart: PropTypes.node.isRequired,
  agentChart: PropTypes.node.isRequired,
  violationChart: PropTypes.node.isRequired,
  genderChart: PropTypes.node.isRequired,
  raceChart: PropTypes.node.isRequired,
  districtChart: PropTypes.node.isRequired,
};

export default RevocationCharts;
