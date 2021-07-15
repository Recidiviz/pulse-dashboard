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
import { observer } from "mobx-react-lite";
import React from "react";
import { useLocation } from "react-router-dom";

import { useCoreStore } from "../CoreStoreProvider";
import PageTemplate from "../PageTemplate";
import PopulationFilterBar from "../PopulationFilterBar";
// TODO(recidiviz-data/issues/6185): Use PopulationSummaryMetrics when data is valid
import PopulationSummaryMetrics from "../PopulationSummaryMetrics/TempPopulationSummaryMetrics";
import PopulationTimeSeriesChart from "../PopulationTimeSeriesChart";
import filterOptions from "../utils/filterOptions";
import { getViewFromPathname } from "../views";
import PopulationProjectionLastUpdated from "./PopulationProjectionLastUpdated";

const PageProjections: React.FC = () => {
  const { pathname } = useLocation();
  const { currentTenantId, metricsStore } = useCoreStore();
  const {
    isLoading,
    isError,
    // TODO(recidiviz-data/issues/6185): Uncomment when summary table is valid
    // summaries,
    simulationDate,
  } = metricsStore.projections;

  if (isLoading) {
    return (
      <PageTemplate
        filters={
          <PopulationFilterBar
            view={getViewFromPathname(pathname)}
            // @ts-ignore
            filterOptions={filterOptions[currentTenantId]}
          />
        }
      >
        <PopulationSummaryMetrics isLoading isError={isError} />
        <PopulationProjectionLastUpdated isLoading />
        <PopulationTimeSeriesChart isLoading />
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      filters={
        <PopulationFilterBar
          view={getViewFromPathname(pathname)}
          // @ts-ignore
          filterOptions={filterOptions[currentTenantId]}
        />
      }
    >
      <PopulationSummaryMetrics isError={isError} />
      <PopulationProjectionLastUpdated simulationDate={simulationDate} />
      <PopulationTimeSeriesChart />
    </PageTemplate>
  );
};

export default observer(PageProjections);
