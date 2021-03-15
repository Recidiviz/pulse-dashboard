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
import MetricsCard from "../MetricsCard";
import SummaryMetric, { getDeltaDirection } from "./SummaryMetric";
import LoadingMetrics from "./LoadingMetrics";

import type { HistoricalSummaryRecord } from "../models/types";

const HistoricalSummaryMetrics: React.FC<{
  data?: HistoricalSummaryRecord;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <MetricsCard heading="Past 6 months">
        <LoadingMetrics title="New arrivals" />
        <LoadingMetrics title="Releases" />
        <LoadingMetrics title="Total population" />
      </MetricsCard>
    );
  }
  return (
    <MetricsCard heading="Past 6 months">
      <div className="SummaryMetrics">
        <SummaryMetric
          title="New arrivals"
          value={data.admissionCount}
          percentChange={data.admissionPercentChange}
          deltaDirection={getDeltaDirection({
            percentChange: data.admissionPercentChange,
          })}
        />
        <SummaryMetric
          title="Releases"
          value={data.releaseCount}
          percentChange={data.releasePercentChange}
          deltaDirection={getDeltaDirection({
            percentChange: data.releasePercentChange,
            improvesOnIncrease: true,
          })}
        />
        <SummaryMetric
          title="Total population"
          value={data.totalPopulation}
          percentChange={data.populationPercentChange}
          deltaDirection={getDeltaDirection({
            percentChange: data.populationPercentChange,
          })}
        />
      </div>
    </MetricsCard>
  );
};

export default HistoricalSummaryMetrics;
