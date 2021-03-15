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
import MetricsCard from "../MetricsCard/MetricsCard";
import SummaryMetric from "./SummaryMetric";
import LoadingMetrics from "./LoadingMetrics";

import type { ProjectedSummaryRecord } from "../models/types";
import "./PopulationSummaryMetrics.scss";

const SummaryMetrics: React.FC<{ data: ProjectedSummaryRecord }> = ({
  data,
}) => (
  <div className="SummaryMetrics">
    <SummaryMetric
      title="New arrivals"
      value={data.admissionCount}
      percentChange={data.admissionPercentChange}
      deltaDirection={data.admissionPercentChange > 0 ? "worsened" : "improved"}
      projectedMinMax={[data.admissionCountMin, data.admissionCountMax]}
    />
    <SummaryMetric
      title="Releases"
      value={data.releaseCount}
      percentChange={data.releasePercentChange}
      deltaDirection={data.releasePercentChange > 0 ? "improved" : "worsened"}
      projectedMinMax={[data.releaseCountMin, data.releaseCountMax]}
    />
    <SummaryMetric
      title="Total population"
      value={data.totalPopulation}
      percentChange={data.populationPercentChange}
      deltaDirection={
        data.populationPercentChange > 0 ? "worsened" : "improved"
      }
      projectedMinMax={[
        data.totalPopulationCountMin,
        data.totalPopulationCountMax,
      ]}
    />
  </div>
);

const ProjectedSummaryMetrics: React.FC<{
  data?: ProjectedSummaryRecord;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <MetricsCard heading="Next 6 months" subheading="Projected">
        <LoadingMetrics title="New arrivals" showMinMax />
        <LoadingMetrics title="Releases" showMinMax />
        <LoadingMetrics title="Total population" showMinMax />
      </MetricsCard>
    );
  }

  return (
    <MetricsCard heading="Next 6 months" subheading="Projected">
      {!data ? (
        <div className="MissingProjectionData">
          There are not enough data to generate a projection for this subset of
          the population.
        </div>
      ) : (
        <SummaryMetrics data={data} />
      )}
    </MetricsCard>
  );
};

export default ProjectedSummaryMetrics;
