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
import type { PopulationProjectionSummaryRecord } from "../store/types";

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

const PageProjections: React.FC = () => {
  const data: { [name: string]: PopulationProjectionSummaryRecord } = {
    pastPopulationMetric: {
      admissionCount: 400,
      releaseCount: 700,
      totalPopulation: 13000,
      admissionPercentChange: -5.5,
      releasePercentChange: 7,
      populationPercentChange: -12,
    },
    projectedPopulationMetric: {
      admissionCount: 200,
      releaseCount: 900,
      totalPopulation: 12300,
      admissionPercentChange: 3.8,
      releasePercentChange: 8,
      populationPercentChange: -3.1,
      admissionCountMin: 150,
      admissionCountMax: 250,
      releaseCountMin: 800,
      releaseCountMax: 1000,
      totalPopulationCountMin: 12890,
      totalPopulationCountMax: 13110,
    },
  };
  return (
    <PageTemplate>
      <MetricSection>
        <MetricsCard
          title={<MetricHeading>Past 6 months</MetricHeading>}
          data={data.pastPopulationMetric}
        />
        <MetricsCard
          title={<MetricHeading>Next 6 months</MetricHeading>}
          data={data.projectedPopulationMetric}
        />
      </MetricSection>
    </PageTemplate>
  );
};

export default PageProjections;
