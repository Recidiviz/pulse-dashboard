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
  Gender,
  PopulationProjectionTimeseriesRecord,
  SimulationCompartment,
} from "../models/types";

import "./PopulationTimeseriesChart.scss";
import PopulationTimeseriesLegend from "./PopulationTimeseriesLegend";
import { CORE_VIEWS, getViewFromPathname } from "../views";
import PopulationTimeseriesTooltip from "./PopulationTimeseriesTooltip";

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const ResponsiveXYFrame = require("semiotic/lib/ResponsiveXYFrame") as any;

type MonthOptions = 1 | 6 | 12 | 24 | 60;

type PropTypes = {
  data: PopulationProjectionTimeseriesRecord[];
};

const CURRENT_YEAR = 2021;
const CURRENT_MONTH = 1;

const filterData = (
  monthRange: number,
  gender: Gender,
  compartment: SimulationCompartment,
  status: string,
  data: PopulationProjectionTimeseriesRecord[]
): PopulationProjectionTimeseriesRecord[] => {
  const range = monthRange === 1 ? 6 : monthRange;

  const stepSize = range / 6;

  return data.filter((d) => {
    const monthsOut = (d.year - CURRENT_YEAR) * 12 + (d.month - CURRENT_MONTH);
    return (
      d.gender === gender &&
      d.compartment === compartment &&
      d.legalStatus === status &&
      Math.abs(monthsOut) <= range &&
      monthsOut % stepSize === 0
    );
  });
};

type ChartPoint = {
  date: Date;
  value: number;
  lowerBound?: number;
  upperBound?: number;
};

type PreparedData = {
  historicalPopulation: ChartPoint[];
  projectedPopulation: ChartPoint[];
  uncertainty: ChartPoint[];
};

type PlotLine = {
  data: ChartPoint[];
  color: string;
  dash?: string;
};

const getDate = (d: PopulationProjectionTimeseriesRecord): Date =>
  new Date(d.year, d.month - 1);

const prepareData = (
  data: PopulationProjectionTimeseriesRecord[]
): PreparedData => {
  const historicalPopulation = data
    .filter((d) => d.simulationTag === "HISTORICAL")
    .map((d) => ({
      date: getDate(d),
      value: d.totalPopulation,
    }));

  const projectedPopulation = historicalPopulation.slice(-1).concat(
    data
      .filter((d) => d.simulationTag !== "HISTORICAL")
      .map((d) => ({
        date: getDate(d),
        value: d.totalPopulation,
        lowerBound: d.totalPopulationMin,
        upperBound: d.totalPopulationMax,
      }))
  );

  const uncertainty = [
    historicalPopulation[historicalPopulation.length - 1],
    ...data
      .filter((d) => d.simulationTag !== "HISTORICAL")
      .map((d) => ({ date: getDate(d), value: d.totalPopulationMax })),
    ...data
      .filter((d) => d.simulationTag !== "HISTORICAL")
      .map((d) => ({ date: getDate(d), value: d.totalPopulationMin }))
      .reverse(),
    historicalPopulation[historicalPopulation.length - 1],
  ];

  return { historicalPopulation, projectedPopulation, uncertainty };
};

const getDateRange = (
  firstDate: Date,
  lastDate: Date,
  monthRange: MonthOptions
): { beginDate: Date; endDate: Date } => {
  // set range slightly wider than data
  const beginDate = new Date(firstDate);
  const endDate = new Date(lastDate);

  let offset;
  switch (monthRange) {
    case 1:
    case 6:
      offset = 1;
      break;
    case 12:
      offset = 2;
      break;
    case 24:
      offset = 4;
      break;
    case 60:
      offset = 12;
      break;
    default:
      offset = 4;
  }

  beginDate.setDate(beginDate.getDate() - offset);
  endDate.setDate(endDate.getDate() + offset);

  return { beginDate, endDate };
};

const PopulationTimeseriesChart: React.FC<PropTypes> = ({ data }) => {
  const filtersStore = usePopulationFiltersStore();
  const { gender, supervisionType } = filtersStore.filters;
  const timePeriod: MonthOptions = parseInt(
    filtersStore.filters.timePeriod,
    10
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
    supervisionType,
    data
  );

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
            date: historicalPopulation.slice(-1)[0].date,
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
