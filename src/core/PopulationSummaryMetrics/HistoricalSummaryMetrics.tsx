import React from "react";
import MetricsCard from "../MetricsCard";
import SummaryMetric from "./SummaryMetric";
import type { HistoricalSummaryRecord } from "../models/types";

const HistoricalSummaryMetrics: React.FC<{
  data: HistoricalSummaryRecord;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  return (
    <MetricsCard heading="Past 6 months">
      <SummaryMetric
        title="New arrivals"
        value={data.admissionCount}
        percentChange={data.admissionPercentChange}
        deltaDirection={
          data.admissionPercentChange > 0 ? "worsened" : "improved"
        }
      />
      <SummaryMetric
        title="Releases"
        value={data.releaseCount}
        percentChange={data.releasePercentChange}
        deltaDirection={data.releasePercentChange > 0 ? "improved" : "worsened"}
      />
      <SummaryMetric
        title="Total population"
        value={data.totalPopulation}
        percentChange={data.populationPercentChange}
        deltaDirection={
          data.populationPercentChange > 0 ? "worsened" : "improved"
        }
      />
    </MetricsCard>
  );
};

export default HistoricalSummaryMetrics;
