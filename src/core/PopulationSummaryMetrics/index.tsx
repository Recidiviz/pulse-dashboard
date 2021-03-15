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
import HistoricalSummaryMetrics from "./HistoricalSummaryMetrics";
import ProjectedSummaryMetrics from "./ProjectedSummaryMetrics";
import useChartData from "../hooks/useChartData";

import type {
  PopulationProjectionSummaryRecords,
  HistoricalSummaryRecord,
  ProjectedSummaryRecord,
  RawApiData,
} from "../models/types";
import {
  recordMatchesSimulationTag,
  populationProjectionSummary,
} from "../models/PopulationProjectionSummaryMetric";
import "./PopulationSummaryMetrics.scss";

type ChartDataType = {
  isLoading: boolean;
  isError: boolean;
  apiData: RawApiData;
};

const PopulationSummaryMetrics: React.FC = () => {
  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_id/projections"
  ) as ChartDataType;

  // TODO: add in Error state
  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="PopulationSummaryMetrics">
        <HistoricalSummaryMetrics isLoading />
        <ProjectedSummaryMetrics isLoading />
      </div>
    );
  }

  // Transform the records
  const projectionSummaries: PopulationProjectionSummaryRecords = populationProjectionSummary(
    apiData.population_projection_summaries.data
  );

  // Filter into historical and projected records
  const historicalPopulationSummaries = projectionSummaries.filter(
    recordMatchesSimulationTag("HISTORICAL")
  );

  const projectedPopulationSummaries = projectionSummaries.filter(
    recordMatchesSimulationTag("POLICY_A")
  );

  const historicalData = historicalPopulationSummaries[0] as HistoricalSummaryRecord;
  const projectedData = projectedPopulationSummaries[0] as ProjectedSummaryRecord;

  return (
    <div className="PopulationSummaryMetrics">
      <HistoricalSummaryMetrics isLoading={isLoading} data={historicalData} />
      <ProjectedSummaryMetrics isLoading={isLoading} data={projectedData} />
    </div>
  );
};

export default PopulationSummaryMetrics;
