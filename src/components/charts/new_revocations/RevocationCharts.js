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
      <div className="selected-chart p-20">
        {renderSelectedChartSingularLoad()}
      </div>
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
