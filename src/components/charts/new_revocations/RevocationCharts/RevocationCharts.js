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
import RevocationsByRiskLevel from "../RevocationsByRiskLevel/RevocationsByRiskLevel";
import RevocationsByOfficer from "../RevocationsByOfficer";
import RevocationsByViolation from "../RevocationsByViolation";
import RevocationsByGender from "../RevocationsByGender/RevocationsByGender";
import RevocationsByRace from "../RevocationsByRace/RevocationsByRace";
import RevocationsByDistrict from "../RevocationsByDistrict/RevocationsByDistrict";
import { useRootStore } from "../../../../StoreProvider";

import "./RevocationCharts.scss";

const CHARTS = [
  "District",
  flags.enableOfficerChart && "Officer",
  "Risk level",
  "Violation",
  "Gender",
  "Race",
].filter(Boolean);

const RevocationCharts = ({ timeDescription }) => {
  const { dataStore } = useRootStore();
  const store = dataStore.revocationsChartsStore;
  const { selectedChart, setSelectedChart } = store;

  const renderSelectedChartSingularLoad = () => {
    switch (selectedChart) {
      case "Risk level":
        return (
          <RevocationsByRiskLevel
            timeDescription={timeDescription}
            dataStore={store}
          />
        );
      case "Officer":
        return (
          <RevocationsByOfficer
            timeDescription={timeDescription}
            dataStore={store}
          />
        );
      case "Violation":
        return (
          <RevocationsByViolation
            timeDescription={timeDescription}
            dataStore={store}
          />
        );
      case "Gender":
        return (
          <RevocationsByGender
            timeDescription={timeDescription}
            dataStore={store}
          />
        );
      case "Race":
        return (
          <RevocationsByRace
            timeDescription={timeDescription}
            dataStore={store}
          />
        );
      case "District":
      default:
        return (
          <RevocationsByDistrict
            timeDescription={timeDescription}
            dataStore={store}
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
        {renderSelectedChartSingularLoad()}
      </div>
    </div>
  );
};

RevocationCharts.propTypes = {
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationCharts);
