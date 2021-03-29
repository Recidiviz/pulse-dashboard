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

import React, { useState } from "react";
import { curveCatmullRom } from "d3-shape";
import { VitalsTimeSeriesRecord } from "../models/types";
import { formatPercent, formatISODateString } from "../../utils/formatStrings";
import VitalsSummaryTooltip from "./VitalsSummaryTooltip";
import * as styles from "../CoreConstants.scss";

import "./VitalsSummaryChart.scss";
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveOrdinalFrame = require("semiotic/lib/ResponsiveOrdinalFrame") as any;

interface PropTypes {
  data: VitalsTimeSeriesRecord[];
}

const BAR_WIDTH = 16;

const VitalsSummaryChart: React.FC<PropTypes> = ({ data }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const lineCoordinates = data.map((record, index) => ({
    index,
    value: record.weeklyAvg,
    percent: record.value,
    weeklyAvg: record.weeklyAvg,
    date: record.date,
  }));

  const ordinalData = data.map((record, index) => ({
    index,
    value: record.value,
    percent: record.value,
    weeklyAvg: record.weeklyAvg,
    date: record.date,
  }));

  return (
    <div className="VitalsSummaryChart">
      <ResponsiveOrdinalFrame
        responsiveWidth
        annotations={[
          {
            type: "ordinal-line",
            coordinates: lineCoordinates,
            lineStyle: {
              stroke: styles.indigo,
              strokeWidth: 2,
            },
            curve: curveCatmullRom,
            interactive: true,
          },
        ]}
        customHoverBehavior={(piece: any) => {
          if (piece) {
            setHoveredId(piece.index);
          } else {
            setHoveredId(null);
          }
        }}
        baseMarkProps={{ transitionDuration: { default: 500 } }}
        svgAnnotationRules={(annotation: any) => {
          if (annotation.d.type === "frame-hover") {
            const { d, adjustedSize, orFrameState } = annotation;
            const column = orFrameState.projectedColumns[d.date];
            const cx = column.middle;
            const cy = adjustedSize[1] - d.weeklyAvg * 2;
            setHoveredId(d.index);
            return <circle cx={cx} cy={cy} r={4} fill={styles.indigo} />;
          }
          setHoveredId(null);
          return null;
        }}
        pieceHoverAnnotation={[
          {
            type: "frame-hover",
          },
        ]}
        tooltipContent={(d: any) => <VitalsSummaryTooltip data={d.data} />}
        type="bar"
        data={ordinalData}
        margin={{ left: 104, bottom: 50, right: 56, top: 50 }}
        oAccessor="date"
        style={(d: any) => {
          if (d.index === hoveredId) {
            return { fill: styles.slate30Opaque, width: BAR_WIDTH };
          }
          return { fill: styles.marble4, width: BAR_WIDTH };
        }}
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
            key: "percent",
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
