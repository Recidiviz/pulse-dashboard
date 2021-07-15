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
import numeral from "numeral";
import React from "react";

import { formatLargeNumber } from "../../utils/formatStrings";
import PercentDelta from "../controls/PercentDelta";
import type {
  HistoricalSummaryRecord,
  ProjectedSummaryRecord,
} from "../models/types";
import LoadingMetrics from "./LoadingMetrics";

function formatMinMax(number: number): string {
  return numeral(number).format("0");
}

interface SummaryMetricProps {
  title: string;
  value: number;
  percentChange: number;
  improvesOnIncrease?: boolean;
  projectedMinMax?: number[] | null;
}

const SummaryMetric: React.FC<SummaryMetricProps> = ({
  title,
  value,
  percentChange,
  improvesOnIncrease = false,
  projectedMinMax = null,
}) => {
  return (
    <div className="SummaryMetric">
      <div className="SummaryMetric__title">{title}</div>
      <div className="SummaryMetric__value">
        <div>{formatLargeNumber(value)}</div>
      </div>
      <PercentDelta
        className="SummaryMetric__delta"
        value={percentChange}
        improvesOnIncrease={improvesOnIncrease}
      />
      {projectedMinMax && (
        <div className="SummaryMetric__min-max">
          <div>({projectedMinMax.map(formatMinMax).join(", ")})</div>
        </div>
      )}
    </div>
  );
};

const SummaryMetrics: React.FC<{
  isLoading: boolean;
  data?: ProjectedSummaryRecord | HistoricalSummaryRecord;
  showMinMax?: boolean;
}> = ({ isLoading, data, showMinMax = false }) => {
  return (
    <div className="SummaryMetrics">
      {isLoading ? (
        <>
          <LoadingMetrics title="New arrivals" showMinMax={showMinMax} />
          <LoadingMetrics title="Releases" showMinMax={showMinMax} />
          <LoadingMetrics title="Total population" showMinMax={showMinMax} />
        </>
      ) : (
        data && (
          <>
            <SummaryMetric
              title="New arrivals"
              value={data.admissionCount}
              percentChange={data.admissionPercentChange}
              projectedMinMax={
                "admissionCountMin" in data
                  ? [data.admissionCountMin, data.admissionCountMax]
                  : undefined
              }
            />
            <SummaryMetric
              title="Releases"
              improvesOnIncrease
              value={data.releaseCount}
              percentChange={data.releasePercentChange}
              projectedMinMax={
                "releaseCountMin" in data
                  ? [data.releaseCountMin, data.releaseCountMax]
                  : undefined
              }
            />
            <SummaryMetric
              title="Total population"
              value={data.totalPopulation}
              percentChange={data.populationPercentChange}
              projectedMinMax={
                "totalPopulationCountMin" in data
                  ? [data.totalPopulationCountMin, data.totalPopulationCountMax]
                  : undefined
              }
            />
          </>
        )
      )}
    </div>
  );
};

export default SummaryMetrics;
