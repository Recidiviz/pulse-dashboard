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
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import flags from "../../../../flags";

import "./RevocationCharts.scss";

const CHARTS = [
  "District",
  flags.enableOfficerChart && "Officer",
  "Risk level",
  "Violation",
  "Gender",
  "Race",
].filter(Boolean);

const RevocationCharts = ({
  riskLevelChart,
  officerChart,
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
      case "Officer":
        return officerChart;
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
      <div className="RevocationCharts__chart">
        {renderSelectedChartSingularLoad()}
      </div>
    </div>
  );
};

RevocationCharts.propTypes = {
  riskLevelChart: PropTypes.node.isRequired,
  officerChart: PropTypes.node.isRequired,
  violationChart: PropTypes.node.isRequired,
  genderChart: PropTypes.node.isRequired,
  raceChart: PropTypes.node.isRequired,
  districtChart: PropTypes.node.isRequired,
};

export default RevocationCharts;
