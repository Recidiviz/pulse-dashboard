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
import { observer } from "mobx-react-lite";
import { curveCatmullRom } from "d3-shape";
import { formatPercent, formatISODateString } from "../../utils/formatStrings";
import VitalsSummaryTooltip from "./VitalsSummaryTooltip";
import { useCoreStore } from "../CoreStoreProvider";
import { METRIC_TYPES } from "../PageVitals/types";

import * as styles from "../CoreConstants.scss";

import "./VitalsSummaryChart.scss";
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveOrdinalFrame = require("semiotic/lib/ResponsiveOrdinalFrame") as any;

const goals = {
  [METRIC_TYPES.OVERALL]: 80,
  [METRIC_TYPES.DISCHARGE]: 90,
  [METRIC_TYPES.CONTACT]: 80,
  [METRIC_TYPES.RISK_ASSESSMENT]: 85,
};

const VitalsSummaryChart: React.FC = () => {
  const { vitalsPageStore, tenantStore } = useCoreStore();
  const { stateCode } = tenantStore;
  const { selectedMetricTimeSeries, selectedMetricId } = vitalsPageStore;
  const [hoveredId, setHoveredId] = useState(null);

  if (!selectedMetricTimeSeries) return <div className="VitalsSummaryChart" />;

  const timeSeries = selectedMetricTimeSeries.slice(-180);
  const goal = goals[selectedMetricId];
  const lineCoordinates = timeSeries.map((record, index) => ({
    index,
    value: record.monthlyAvg,
    percent: record.value,
    monthlyAvg: record.monthlyAvg,
    date: record.date,
  }));

  const ordinalData = timeSeries.map((record, index) => ({
    index,
    value: record.value,
    percent: record.value,
    monthlyAvg: record.monthlyAvg,
    date: record.date,
  }));
  const latestDataPoint = ordinalData[ordinalData.length - 1];

  const goalLabelAnnotation = (annotation: any) => {
    const { d, adjustedSize, rScale, oScale } = annotation;
    const x = oScale(d.date);
    const y = adjustedSize[1] - rScale(d.value) - 10;
    return (
      <g className="VitalsSummaryChart__goal-label" textAnchor="end">
        <text x={x} y={y}>{`${stateCode} Goal: ${formatPercent(goal)}`}</text>
      </g>
    );
  };

  const trendlinePointAnnotation = (annotation: any) => {
    const { d, adjustedSize, rScale } = annotation;
    const { pieces, column } = d;
    const { data: pieceData } = pieces[0];
    const cx = column.middle;
    const cy = adjustedSize[1] - rScale(pieceData.monthlyAvg);
    setHoveredId(pieceData.index);
    return <circle cx={cx} cy={cy} r={4} fill={styles.indigo} />;
  };

  const goalTargetAnnotation = (annotation: any) => {
    const { d, adjustedSize, rScale, orFrameState } = annotation;
    const { monthlyAvg, date } = d;
    const cx = orFrameState.projectedColumns[date].middle;
    const cy = adjustedSize[1] - rScale(monthlyAvg);
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill={styles.white}
          stroke={styles.crimson}
        />
        <circle
          cx={cx}
          cy={cy}
          r="4"
          fill={styles.crimson}
          stroke={styles.crimson}
        />
      </g>
    );
  };

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
          {
            type: "or",
            ...latestDataPoint,
          },
          {
            type: "react-annotation",
            date: latestDataPoint.date,
            value: goal,
          },
          {
            type: "r",
            value: goal,
            color: styles.signalLinks,
            disable: "connector",
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
          if (annotation.d.type === "react-annotation") {
            return goalLabelAnnotation(annotation);
          }
          if (annotation.d.type === "column-hover") {
            return trendlinePointAnnotation(annotation);
          }
          if (annotation.d.type === "or") {
            return goalTargetAnnotation(annotation);
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
              transformX={pieceData.index > timeSeries.length - 20}
              transformY={columnData.scaledValue < 50}
            />
          );
        }}
        type="bar"
        data={ordinalData}
        margin={{ left: 104, bottom: 50, right: 56, top: 50 }}
        oAccessor="date"
        oPadding={2}
        style={(d: any) => {
          if (d.index === hoveredId) {
            return { fill: styles.slate30Opaque };
          }
          return { fill: styles.marble4 };
        }}
        rAccessor="value"
        rExtent={[0, 100]}
        size={[0, 295]}
        oLabel={(date: string, _: any, index: number) => {
          // Display the first and then every 30 labels
          if (index === 0 || (index + 1) % 30 === 0) {
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

export default observer(VitalsSummaryChart);
