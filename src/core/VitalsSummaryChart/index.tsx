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
        hoverAnnotation
        annotations={[
          {
            type: "ordinal-line",
            coordinates: lineCoordinates,
            lineStyle: {
              stroke: styles.indigo,
              strokeWidth: 2,
            },
            curve: curveCatmullRom,
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
          if (annotation.d.type === "column-hover") {
            const { d, adjustedSize } = annotation;
            const { pieces, column } = d;
            const { data: pieceData } = pieces[0];
            // // Shift the point slightly to the left to center it
            const cx = column.middle - column.width / 4;
            const cy = adjustedSize[1] - pieceData.weeklyAvg * 2;
            setHoveredId(pieceData.index);
            return <circle cx={cx} cy={cy} r={4} fill={styles.indigo} />;
          }
          setHoveredId(null);
          return null;
        }}
        tooltipContent={(d: any) => {
          const pieceData = d.pieces[0];
          const columnData = d.column.pieceData[0];
          return (
            <VitalsSummaryTooltip
              data={pieceData}
              transformX={pieceData.index > data.length - 4}
              transformY={columnData.scaledValue < 50}
            />
          );
        }}
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
        rExtent={[0, 100]}
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
