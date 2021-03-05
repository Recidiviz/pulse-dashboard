// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import cn from "classnames";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import { translate } from "../../utils/i18nSettings";
import RevocationsByRiskLevel from "../RevocationsByRiskLevel";
import RevocationsByOfficer from "../RevocationsByOfficer";
import RevocationsByViolation from "../RevocationsByViolation";
import RevocationsByGender from "../RevocationsByGender";
import RevocationsByRace from "../RevocationsByRace";
import RevocationsByDistrict from "../RevocationsByDistrict";
import { useRootStore } from "../../components/StoreProvider";
import { useContainerHeight } from "../hooks/useContainerHeight";
import "./RevocationCharts.scss";

const CHARTS = [
  "District",
  "Officer",
  "Risk level",
  "Violation",
  "Gender",
  "Race",
].filter(Boolean);

const RevocationCharts = ({ timeDescription }) => {
  const { dataStore } = useRootStore();
  const { selectedChart, setSelectedChart } = dataStore.revocationsChartStore;
  const { containerHeight, containerRef } = useContainerHeight();
  const props = { ref: containerRef, timeDescription, containerHeight };

  const renderSelectedChartSingularLoad = () => {
    switch (selectedChart) {
      case "Risk level":
        return <RevocationsByRiskLevel {...props} />;
      case "Officer":
        return <RevocationsByOfficer {...props} />;
      case "Violation":
        return <RevocationsByViolation {...props} />;
      case "Gender":
        return <RevocationsByGender {...props} />;
      case "Race":
        return <RevocationsByRace {...props} />;
      case "District":
      default:
        return <RevocationsByDistrict {...props} />;
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
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationCharts);
