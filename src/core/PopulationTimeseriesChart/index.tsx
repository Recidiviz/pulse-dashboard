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
import { useLocation } from "react-router-dom";
import { scaleTime } from "d3-scale";
import { observer } from "mobx-react-lite";
import { usePopulationFiltersStore } from "../../components/StoreProvider";
import {
  PopulationProjectionTimeseriesRecord,
  SimulationCompartment,
} from "../models/types";

import "./PopulationTimeseriesChart.scss";
import PopulationTimeseriesLegend from "./PopulationTimeseriesLegend";
import { CORE_VIEWS, getViewFromPathname } from "../views";
import PopulationTimeseriesTooltip from "./PopulationTimeseriesTooltip";

import {
  ChartPoint,
  getDateRange,
  MonthOptions,
  prepareData,
  filterData,
} from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveXYFrame = require("semiotic/lib/ResponsiveXYFrame") as any;

type PlotLine = {
  data: ChartPoint[];
  color: string;
  dash?: string;
};

type PropTypes = {
  data: PopulationProjectionTimeseriesRecord[];
};

const PopulationTimeseriesChart: React.FC<PropTypes> = ({ data }) => {
  const filtersStore = usePopulationFiltersStore();
  const { gender, supervisionType, legalStatus } = filtersStore.filters;
  const timePeriod: MonthOptions = parseInt(
    filtersStore.filters.timePeriod
  ) as MonthOptions;

  const view = getViewFromPathname(useLocation().pathname);

  let compartment: SimulationCompartment;

  switch (view) {
    case CORE_VIEWS.community:
      compartment = "SUPERVISION";
      break;
    case CORE_VIEWS.facilities:
      compartment = "INCARCERATION";
      break;
    default:
      // TODO: Error state
      return <div />;
  }

  const filteredData = filterData(
    timePeriod,
    gender,
    compartment,
    compartment === "SUPERVISION" ? supervisionType : legalStatus,
    data
  ).sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
  // TODO(recidiviz-data/issues/6651): Sort data on backend

  if (filteredData.length < 1) {
    // TODO: Error state
    return <div />;
  }

  const {
    historicalPopulation,
    projectedPopulation,
    uncertainty,
  } = prepareData(filteredData);

  const { beginDate, endDate } = getDateRange(
    historicalPopulation[0].date,
    projectedPopulation.slice(-1)[0].date,
    timePeriod
  );

  // update uncertainty range so areas align
  uncertainty[uncertainty.length / 2].date = endDate;
  uncertainty[uncertainty.length / 2 - 1].date = endDate;

  // set top of chart to the nearest thousand above the highest uncertainty value
  const maxValue = Math.max(...uncertainty.map((d) => d.value));
  const chartTop = (Math.ceil(maxValue / 1000) + 1) * 1000;

  const projectionArea = [
    { date: historicalPopulation.slice(-1)[0].date, value: 0 },
    { date: historicalPopulation.slice(-1)[0].date, value: chartTop },
    { date: endDate, value: chartTop },
    { date: endDate, value: 0 },
  ];

  const historicalLine: PlotLine = {
    color: "#25636F",
    data: historicalPopulation,
  };

  const projectedLine: PlotLine = {
    color: "#25636F",
    dash: "2.5, 3",
    data: projectedPopulation,
  };

  const populationType =
    compartment === "SUPERVISION" ? "Supervised" : "Incarcerated";

  return (
    <div className="PopulationTimeseriesChart">
      <div className="PopulationTimeseriesChart__Header">
        <div className="PopulationTimeseriesChart__Title">
          Total {populationType} Population
        </div>
        <PopulationTimeseriesLegend items={["Actual", "Projected"]} />
      </div>
      <ResponsiveXYFrame
        responsiveWidth
        annotations={[
          {
            type: "area",
            className: "uncertainty",
            coordinates: uncertainty,
          },
          {
            type: "area",
            className: "projection-area",
            coordinates: projectionArea,
          },
          {
            type: "x",
            className: "projection-area-label",
            date: projectedPopulation[0].date,
            note: {
              label: "PROJECTED",
              align: "middle",
              lineType: null,
            },
            color: null,
            connector: { end: "none" },
            dx: 54,
            dy: 24,
          },
        ]}
        hoverAnnotation
        tooltipContent={(d: any) => <PopulationTimeseriesTooltip d={d} />}
        lines={[historicalLine, projectedLine]}
        lineDataAccessor="data"
        lineStyle={(l: PlotLine) => ({
          stroke: l.color,
          strokeWidth: 1,
          strokeDasharray: l.dash ?? "none",
        })}
        xScaleType={scaleTime()}
        xAccessor="date"
        yAccessor="value"
        size={[558, 558]}
        margin={{ left: 104, bottom: 96, right: 56, top: 56 }}
        xExtent={[beginDate, endDate]}
        yExtent={[0, chartTop]}
        showLinePoints
        pointClass="PopulationTimeseriesChart__Point"
        axes={[
          { orient: "left", tickFormat: (n: number) => n.toLocaleString() },
          {
            orient: "bottom",
            tickValues: historicalPopulation
              .concat(projectedPopulation.slice(1)) // don't double-draw center date
              .map((r) => r.date),
            tickFormat: (d: Date) =>
              `${d.toLocaleString("default", { month: "short" })} '${
                d.getFullYear() % 100
              }`,
          },
        ]}
      />
    </div>
  );
};

export default observer(PopulationTimeseriesChart);
