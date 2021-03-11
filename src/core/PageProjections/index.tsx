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
import styled from "styled-components/macro";
import { H4 } from "@recidiviz/case-triage-components";
import PageTemplate from "../PageTemplate";
import MetricsCard from "../MetricsCard";
import useChartData from "../hooks/useChartData";

import type {
  PopulationProjectionSummaryRecord,
  RawApiData,
} from "../models/types";
import {
  recordMatchesSimulationTag,
  populationProjectionSummary,
} from "../models/PopulationProjectionSummaryMetric";

const MetricSection = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
`;

const MetricHeading = styled(H4)`
  height: 64px;
  padding: 25px 40px;
`;

type ChartDataType = {
  isLoading: boolean;
  isError: boolean;
  apiData: RawApiData;
};

const PageProjections: React.FC = () => {
  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_id/projections"
  ) as ChartDataType;

  if (isLoading || isError) {
    // TODO: Loading state
    return null;
  }

  // Transform the records
  const projectionSummaries: PopulationProjectionSummaryRecord[] = populationProjectionSummary(
    apiData.population_projection_summaries.data
  );

  // Filter into historical and projected records
  const historicalPopulationSummaries = projectionSummaries.filter(
    recordMatchesSimulationTag("HISTORICAL")
  );

  const projectedPopulationSummaries = projectionSummaries.filter(
    recordMatchesSimulationTag("POLICY_A")
  );

  return (
    <PageTemplate>
      <MetricSection>
        <MetricsCard
          title={<MetricHeading>Past 6 months</MetricHeading>}
          data={historicalPopulationSummaries[0]}
        />
        <MetricsCard
          title={<MetricHeading>Next 6 months</MetricHeading>}
          data={projectedPopulationSummaries[0]}
        />
      </MetricSection>
    </PageTemplate>
  );
};

export default PageProjections;
