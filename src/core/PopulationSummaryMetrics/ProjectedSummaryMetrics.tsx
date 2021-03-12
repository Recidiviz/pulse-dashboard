import React from "react";
import MetricsCard from "../MetricsCard";
import SummaryMetric from "./SummaryMetric";
import type { ProjectedSummaryRecord } from "../models/types";

const ProjectedSummaryMetrics: React.FC<{
  data: ProjectedSummaryRecord;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  return (
    <MetricsCard heading="Next 6 months" subheading="Projected">
      <SummaryMetric
        title="New arrivals"
        value={data.admissionCount}
        percentChange={data.admissionPercentChange}
        deltaDirection={
          data.admissionPercentChange > 0 ? "worsened" : "improved"
        }
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
    </MetricsCard>
  );
};

export default ProjectedSummaryMetrics;
