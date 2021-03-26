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
import { VitalsTimeseriesRecord } from "../models/types";
import { formatPercent } from "../../utils/formatStrings";
import { formatDate } from "./helpers";
import VitalsSummaryTooltip from "./VitalsSummaryTooltip";
import * as styles from "../CoreConstants.scss";

import "./VitalsSummaryChart.scss";
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveOrdinalFrame = require("semiotic/lib/ResponsiveOrdinalFrame") as any;

// interface PropTypes {
//   data: VitalsTimeseriesRecord[];
// }

const mockData: VitalsTimeseriesRecord[] = [
  { date: "2021-03-01", value: 91, weeklyAvg: 80, parentWeeklyAvg: 100 },
  { date: "2021-03-02", value: 46, weeklyAvg: 82, parentWeeklyAvg: 66 },
  { date: "2021-03-03", value: 88, weeklyAvg: 37, parentWeeklyAvg: 94 },
  { date: "2021-03-04", value: 73, weeklyAvg: 79, parentWeeklyAvg: 70 },
  { date: "2021-03-05", value: 52, weeklyAvg: 46, parentWeeklyAvg: 80 },
  { date: "2021-03-06", value: 41, weeklyAvg: 40, parentWeeklyAvg: 98 },
  { date: "2021-03-07", value: 37, weeklyAvg: 44, parentWeeklyAvg: 63 },
  { date: "2021-03-08", value: 64, weeklyAvg: 12, parentWeeklyAvg: 99 },
  { date: "2021-03-09", value: 65, weeklyAvg: 22, parentWeeklyAvg: 28 },
  { date: "2021-03-10", value: 50, weeklyAvg: 56, parentWeeklyAvg: 22 },
  { date: "2021-03-11", value: 90, weeklyAvg: 88, parentWeeklyAvg: 100 },
  { date: "2021-03-12", value: 66, weeklyAvg: 66, parentWeeklyAvg: 57 },
  { date: "2021-03-13", value: 86, weeklyAvg: 40, parentWeeklyAvg: 56 },
  { date: "2021-03-14", value: 56, weeklyAvg: 63, parentWeeklyAvg: 23 },
  { date: "2021-03-15", value: 15, weeklyAvg: 28, parentWeeklyAvg: 40 },
  { date: "2021-03-16", value: 81, weeklyAvg: 24, parentWeeklyAvg: 26 },
  { date: "2021-03-17", value: 32, weeklyAvg: 27, parentWeeklyAvg: 64 },
  { date: "2021-03-18", value: 31, weeklyAvg: 39, parentWeeklyAvg: 88 },
  { date: "2021-03-19", value: 60, weeklyAvg: 3, parentWeeklyAvg: 6 },
  { date: "2021-03-20", value: 100, weeklyAvg: 48, parentWeeklyAvg: 2 },
  { date: "2021-03-21", value: 55, weeklyAvg: 59, parentWeeklyAvg: 71 },
  { date: "2021-03-22", value: 67, weeklyAvg: 54, parentWeeklyAvg: 36 },
  { date: "2021-03-23", value: 79, weeklyAvg: 97, parentWeeklyAvg: 20 },
  { date: "2021-03-24", value: 69, weeklyAvg: 94, parentWeeklyAvg: 87 },
  { date: "2021-03-25", value: 22, weeklyAvg: 75, parentWeeklyAvg: 13 },
  { date: "2021-03-26", value: 14, weeklyAvg: 50, parentWeeklyAvg: 76 },
  { date: "2021-03-27", value: 3, weeklyAvg: 59, parentWeeklyAvg: 59 },
  { date: "2021-03-28", value: 83, weeklyAvg: 37, parentWeeklyAvg: 38 },
];

const BAR_WIDTH = 16;

const VitalsSummaryChart: React.FC = () => {
  return (
    <div className="VitalsSummaryChart">
      <ResponsiveOrdinalFrame
        responsiveWidth
        pieceHoverAnnotation={[
          {
            type: "highlight",
            style: {
              fill: styles.chartHover,
              width: BAR_WIDTH,
              stroke: "none",
            },
          },
          { type: "frame-hover" },
        ]}
        tooltipContent={(d: any) => <VitalsSummaryTooltip data={d.data} />}
        type="bar"
        data={mockData}
        margin={{ left: 104, bottom: 50, right: 56, top: 50 }}
        oAccessor="date"
        style={{ fill: styles.marble4, width: BAR_WIDTH }}
        rAccessor="value"
        rExtent={[0]}
        size={[0, 400]}
        oLabel={(date: string, _: any, index: number) => {
          // Display the first and then every 7 labels
          if (index === 0 || (index + 1) % 7 === 0) {
            return <text textAnchor="middle">{formatDate(date)}</text>;
          }
          return null;
        }}
        axes={[
          {
            key: "value",
            orient: "left",
            ticks: 3,
            tickValues: [0, 50, 100],
            tickFormat: (n: number) => formatPercent(n),
          },
        ]}
      />
    </div>
  );
};

export default VitalsSummaryChart;
