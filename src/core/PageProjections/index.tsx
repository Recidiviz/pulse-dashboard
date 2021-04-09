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
import useChartData from "../hooks/useChartData";
import {
  // PopulationProjectionSummaryRecords,
  PopulationProjectionTimeSeriesRecord,
} from "../models/types";
// import { populationProjectionSummary } from "../models/PopulationProjectionSummaryMetric";
import PopulationTimeSeriesChart from "../PopulationTimeSeriesChart";
import { populationProjectionTimeSeries } from "../models/PopulationProjectionTimeSeriesMetric";
import PopulationFilterBar from "../PopulationFilterBar";
import filterOptions from "../utils/filterOptions";
import { getViewFromPathname } from "../views";
import { useRootStore } from "../../components/StoreProvider";
import { ChartDataType } from "../types/charts";

const PageProjections: React.FC = () => {
  const { pathname } = useLocation();
  const { currentTenantId } = useRootStore();

  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_id/projections"
  ) as ChartDataType;

  if (isLoading) {
    return (
      <PageTemplate>
        <PopulationSummaryMetrics isLoading={isLoading} isError={isError} />
      </PageTemplate>
    );
  }

  // Transform records
  // TODO(recidiviz-data/issues/6185): Uncomment when summary table is valid
  // const projectionSummaries: PopulationProjectionSummaryRecords = populationProjectionSummary(
  //   apiData.population_projection_summaries.data
  // );

  const projectionTimeSeries: PopulationProjectionTimeSeriesRecord[] = populationProjectionTimeSeries(
    apiData.population_projection_TimeSeries.data
  );

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
      <PopulationSummaryMetrics
        isError={isError}
        projectionSummaries={projectionTimeSeries}
      />
      <PopulationTimeSeriesChart data={projectionTimeSeries} />
    </PageTemplate>
  );
};

export default observer(PageProjections);
