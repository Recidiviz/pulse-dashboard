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
import PageTemplate from "../PageTemplate";
import PopulationSummaryMetrics from "../PopulationSummaryMetrics";
import useChartData from "../hooks/useChartData";
import {
  PopulationProjectionSummaryRecords,
  RawApiData,
} from "../models/types";
import { populationProjectionSummary } from "../models/PopulationProjectionSummaryMetric";
import PopulationTimeseriesChart from "../PopulationTimeseriesChart";
import { populationProjectionTimeseries } from "../models/PopulationProjectionTimeseriesMetric";
import PopulationFilterBar from "../PopulationFilterBar";

type ChartDataType = {
  isLoading: boolean;
  isError: boolean;
  apiData: RawApiData;
};

const PageProjections: React.FC = () => {
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
  const projectionSummaries: PopulationProjectionSummaryRecords = populationProjectionSummary(
    apiData.population_projection_summaries.data
  );

  const projectionTimeseries: PopulationProjectionTimeseriesRecord[] = populationProjectionTimeseries(
    apiData.population_projection_timeseries.data
  );

  return (
    <PageTemplate filters={<PopulationFilterBar />}>
      <PopulationSummaryMetrics
        isError={isError}
        projectionSummaries={projectionSummaries}
      />
      <PopulationTimeseriesChart months={60} data={projectionTimeseries} />
    </PageTemplate>
  );
};

export default PageProjections;
