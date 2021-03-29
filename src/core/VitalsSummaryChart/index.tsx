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
import { VitalsTimeSeriesRecord } from "../models/types";
import { formatPercent, formatISODateString } from "../../utils/formatStrings";
import VitalsSummaryTooltip from "./VitalsSummaryTooltip";
import * as styles from "../CoreConstants.scss";

import "./VitalsSummaryChart.scss";
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveOrdinalFrame = require("semiotic/lib/ResponsiveOrdinalFrame") as any;

interface PropTypes {
  timeSeries: VitalsTimeSeriesRecord[];
}

const BAR_WIDTH = 16;

const VitalsSummaryChart: React.FC<PropTypes> = ({ timeSeries }) => {
  return (
    <div className="VitalsSummaryChart">
      <ResponsiveOrdinalFrame
        responsiveWidth
        pieceHoverAnnotation={[
          {
            type: "highlight",
            style: {
              fill: styles.slate30Opaque,
              width: BAR_WIDTH,
              stroke: "none",
            },
          },
          { type: "frame-hover" },
        ]}
        tooltipContent={(d: any) => <VitalsSummaryTooltip data={d.data} />}
        type="bar"
        data={timeSeries}
        margin={{ left: 104, bottom: 50, right: 56, top: 50 }}
        oAccessor="date"
        style={{ fill: styles.marble4, width: BAR_WIDTH }}
        rAccessor="value"
        rExtent={[0]}
        size={[0, 300]}
        oLabel={(date: string, _: any, index: number) => {
          // Display the first and then every 7 labels
          if (index === 0 || (index + 1) % 7 === 0) {
            return <text textAnchor="middle">{formatISODateString(date)}</text>;
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
