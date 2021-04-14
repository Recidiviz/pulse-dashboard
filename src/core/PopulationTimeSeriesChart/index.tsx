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
import { ResponsiveXYFrame } from "semiotic";
import { usePopulationFiltersStore } from "../../components/StoreProvider";
import {
  PopulationProjectionTimeSeriesRecord,
  SimulationCompartment,
} from "../models/types";

import "./PopulationTimeSeriesChart.scss";
import PopulationTimeSeriesLegend from "./PopulationTimeSeriesLegend";
import { CORE_VIEWS, getViewFromPathname } from "../views";
import PopulationTimeSeriesTooltip from "./PopulationTimeSeriesTooltip";
import * as styles from "../CoreConstants.scss";

import {
  ChartPoint,
  getDateRange,
  MonthOptions,
  prepareData,
  filterData,
} from "./helpers";

type PlotLine = {
  data: ChartPoint[];
  class: string;
};

type PropTypes = {
  data: PopulationProjectionTimeSeriesRecord[];
};

const PopulationTimeSeriesChart: React.FC<PropTypes> = ({ data }) => {
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
    {
      data: [
        { date: projectedPopulation[0].date, value: 0 },
        { date: projectedPopulation[0].date, value: chartTop },
        { date: endDate, value: chartTop },
        { date: endDate, value: 0 },
      ],
    },
  ];

  const historicalLine: PlotLine = {
    class: "PopulationTimeSeriesChart__HistoricalLine",
    data: historicalPopulation,
  };

  const projectedLine: PlotLine = {
    class: "PopulationTimeSeriesChart__ProjectedLine",
    data: projectedPopulation,
  };

  const populationType =
    compartment === "SUPERVISION" ? "Supervised" : "Incarcerated";

  return (
    <div className="PopulationTimeSeriesChart">
      <div className="PopulationTimeSeriesChart__Header">
        <div className="PopulationTimeSeriesChart__Title">
          Total {populationType} Population
        </div>
        <PopulationTimeSeriesLegend items={["Actual", "Projected"]} />
      </div>
      <ResponsiveXYFrame
        responsiveWidth
        // @ts-ignore
        summaries={projectionArea}
        summaryDataAccessor="data"
        summaryClass="projection-area"
        annotations={[
          {
            type: "area",
            className: "uncertainty",
            coordinates: uncertainty,
          },
          {
            type: "x",
            className: "projection-area-label",
            date: projectedPopulation.slice(-1)[0].date,
            note: {
              label: "Projected",
              align: "middle",
              lineType: null,
            },
            color: null,
            connector: { end: "none" },
            dx: -49,
            dy: 370,
          },
          {
            type: "y",
            value:
              gender === "ALL" &&
              legalStatus === "ALL" &&
              compartment === "INCARCERATION"
                ? 8008
                : 1e6,
            // Need to send this line off of the chart when not looking at all
            // incarcerated people. We need to move it instead of deleting it
            // to prevent semiotic from deleting and rerendering the annotation
            // layer which makes the uncertainty band just appear at its new location
            // instead of transforming its way there
            disable: "connector",
            color: styles.crimsonDark50,
            note: {
              label: "Total Operational Capacity (includes CAPP): 8,008",
              align: "left",
              lineType: null,
              // @ts-ignore
              color: styles.crimsonDark,
              wrap: 500,
            },
            dx: -40,
            dy: -8,
          },
        ]}
        hoverAnnotation
        svgAnnotationRules={(d: any) => {
          // don't display hover annotations on corners of projection box
          if (d.d.parentSummary !== undefined) {
            return false;
          }
          return null;
        }}
        tooltipContent={(d: any) => <PopulationTimeSeriesTooltip d={d} />}
        // @ts-ignore
        lines={[historicalLine, projectedLine]}
        lineDataAccessor="data"
        // @ts-ignore
        lineClass={(l: PlotLine) => l.class}
        // @ts-ignore
        xScaleType={scaleTime()}
        xAccessor="date"
        yAccessor="value"
        size={[558, 558]}
        margin={{ left: 104, bottom: 96, right: 50, top: 56 }}
        // @ts-ignore
        xExtent={[beginDate, endDate]}
        yExtent={[0, chartTop]}
        showLinePoints
        pointClass="PopulationTimeSeriesChart__Point"
        axes={[
          { orient: "left", tickFormat: (n: number) => n.toLocaleString() },
          {
            orient: "bottom",
            // @ts-ignore
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

export default observer(PopulationTimeSeriesChart);
