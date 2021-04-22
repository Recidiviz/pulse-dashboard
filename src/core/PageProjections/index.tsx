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
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import PageTemplate from "../PageTemplate";
// TODO(recidiviz-data/issues/6185): Use PopulationSummaryMetrics when data is valid
import PopulationSummaryMetrics from "../PopulationSummaryMetrics/TempPopulationSummaryMetrics";
import PopulationTimeSeriesChart from "../PopulationTimeSeriesChart";
import PopulationProjectionLastUpdated from "./PopulationProjectionLastUpdated";
import PopulationFilterBar from "../PopulationFilterBar";
import filterOptions from "../utils/filterOptions";
import { getViewFromPathname } from "../views";
import { useCoreStore } from "../CoreStoreProvider";

const PageProjections: React.FC = () => {
  const { pathname } = useLocation();
  const { currentTenantId, metricsStore } = useCoreStore();
  const {
    isLoading,
    isError,
    // TODO(recidiviz-data/issues/6185): Uncomment when summary table is valid
    // summaries,
    timeSeries,
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
        <PopulationSummaryMetrics isLoading={isLoading} isError={isError} />
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
      <PopulationProjectionLastUpdated projectionTimeSeries={timeSeries} />
      <PopulationTimeSeriesChart />
    </PageTemplate>
  );
};

export default observer(PageProjections);
