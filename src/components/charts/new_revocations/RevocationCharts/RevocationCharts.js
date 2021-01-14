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
import cn from "classnames";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import { translate } from "../../../../views/tenants/utils/i18nSettings";
import flags from "../../../../flags";
import ErrorBoundary from "../../../ErrorBoundary";
import RevocationsByRiskLevel from "../RevocationsByRiskLevel/RevocationsByRiskLevel";
import RevocationsByOfficer from "../RevocationsByOfficer";
import RevocationsByViolation from "../RevocationsByViolation";
import RevocationsByGender from "../RevocationsByGender/RevocationsByGender";
import RevocationsByRace from "../RevocationsByRace/RevocationsByRace";
import RevocationsByDistrict from "../RevocationsByDistrict/RevocationsByDistrict";

import "./RevocationCharts.scss";
import { dataStorePropTypes } from "../../propTypes";

const CHARTS = [
  "District",
  flags.enableOfficerChart && "Officer",
  "Risk level",
  "Violation",
  "Gender",
  "Race",
].filter(Boolean);

const RevocationCharts = ({ dataStore, timeDescription }) => {
  const { selectedChart, setSelectedChart } = dataStore;

  const renderSelectedChartSingularLoad = () => {
    switch (selectedChart) {
      case "Risk level":
        return (
          <RevocationsByRiskLevel
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
      case "Officer":
        return (
          <RevocationsByOfficer
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
      case "Violation":
        return (
          <RevocationsByViolation
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
      case "Gender":
        return (
          <RevocationsByGender
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
      case "Race":
        return (
          <RevocationsByRace
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
      case "District":
      default:
        return (
          <RevocationsByDistrict
            timeDescription={timeDescription}
            dataStore={dataStore}
          />
        );
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
        <ErrorBoundary>{renderSelectedChartSingularLoad()}</ErrorBoundary>
      </div>
    </div>
  );
};

RevocationCharts.propTypes = {
  dataStore: dataStorePropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationCharts);
