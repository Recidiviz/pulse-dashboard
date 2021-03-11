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
import { Card, CardSection } from "@recidiviz/case-triage-components";
import Metric from "./Metric";
import type { PopulationProjectionSummaryRecord } from "../models/types";

const MetricsCardComponent = styled(Card)`
  width: 100%;
  margin: 1rem;
`;

const MetricsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  height: 168px;
`;

interface MetricsCardProps {
  title: React.ReactElement;
  data: PopulationProjectionSummaryRecord;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, data }) => {
  return (
    <MetricsCardComponent stacked>
      <CardSection>{title}</CardSection>
      <MetricsContainer>
        <Metric
          title="New arrivals"
          value={data.admissionCount}
          percentChange={data.admissionPercentChange}
          deltaDirection={
            data.admissionPercentChange > 0 ? "worsened" : "improved"
          }
          projectedMinMax={
            data.admissionCountMin && data.admissionCountMax
              ? [data.admissionCountMin, data.admissionCountMax]
              : null
          }
        />
        <Metric
          title="Releases"
          value={data.releaseCount}
          percentChange={data.releasePercentChange}
          deltaDirection={
            data.releasePercentChange > 0 ? "improved" : "worsened"
          }
          projectedMinMax={
            data.releaseCountMin && data.releaseCountMax
              ? [data.releaseCountMin, data.releaseCountMax]
              : null
          }
        />
        <Metric
          title="Total population"
          value={data.totalPopulation}
          percentChange={data.populationPercentChange}
          deltaDirection={
            data.populationPercentChange > 0 ? "worsened" : "improved"
          }
          projectedMinMax={
            data.totalPopulationCountMin && data.totalPopulationCountMax
              ? [data.totalPopulationCountMin, data.totalPopulationCountMax]
              : null
          }
        />
      </MetricsContainer>
    </MetricsCardComponent>
  );
};

export default MetricsCard;
