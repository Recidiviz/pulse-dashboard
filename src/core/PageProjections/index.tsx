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
import PageTemplate from "../PageTemplate";
import PopulationSummaryMetrics from "../PopulationSummaryMetrics";
import useChartData from "../hooks/useChartData";
import {
  PopulationProjectionSummaryRecords,
  PopulationProjectionTimeseriesRecord,
  RawApiData,
} from "../models/types";
import { populationProjectionSummary } from "../models/PopulationProjectionSummaryMetric";
import PopulationTimeseriesChart from "../PopulationTimeseriesChart";
import { populationProjectionTimeseries } from "../models/PopulationProjectionTimeseriesMetric";
import CoreFilterBar from "../CoreFilterBar";
import { useCoreFiltersStore } from "../../components/StoreProvider/StoreProvider";

type ChartDataType = {
  isLoading: boolean;
  isError: boolean;
  apiData: RawApiData;
};

const PageProjections: React.FC = () => {
  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_id/projections"
  ) as ChartDataType;

  const filtersStore = useCoreFiltersStore();

  const setTimePeriod = (value: string) => {
    filtersStore.setFilters({ timePeriod: value });
  };

  const filters = (
    <CoreFilterBar
      metricPeriodMonths={filtersStore.filters.timePeriod}
      setChartMetricPeriodMonths={setTimePeriod}
    />
  );

  if (isLoading) {
    return (
      <PageTemplate>
        <PopulationSummaryMetrics isLoading={isLoading} isError={isError} />
      </PageTemplate>
    );
  }

  // Transform records
  const projectionSummaries: PopulationProjectionSummaryRecords = populationProjectionSummary(
    apiData.population_projection_summaries.data
  );

  const projectionTimeseries: PopulationProjectionTimeseriesRecord[] = populationProjectionTimeseries(
    apiData.population_projection_timeseries.data
  );

  return (
    <PageTemplate filters={filters}>
      <PopulationSummaryMetrics
        isError={isError}
        projectionSummaries={projectionSummaries}
      />
      <PopulationTimeseriesChart months={60} data={projectionTimeseries} />
    </PageTemplate>
  );
};

export default observer(PageProjections);
