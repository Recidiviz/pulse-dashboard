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

import { formatDate } from "../../utils/formatStrings";
import { PopulationProjectionTimeSeriesRecord } from "../models/types";

export type MonthOptions = 1 | 6 | 12 | 24 | 60;

export type ChartPoint = {
  date: Date;
  value: number;
  lowerBound?: number;
  upperBound?: number;
};

export type PreparedData = {
  historicalPopulation: ChartPoint[];
  projectedPopulation: ChartPoint[];
  uncertainty: ChartPoint[];
};

export const getRecordDate = (d: PopulationProjectionTimeSeriesRecord): Date =>
  new Date(d.year, d.month - 1);

export const prepareData = (
  data: PopulationProjectionTimeSeriesRecord[]
): PreparedData => {
  const historicalPopulation = data
    .filter((d) => d.simulationTag === "HISTORICAL")
    .map((d) => ({
      date: getRecordDate(d),
      value: d.totalPopulation,
    }));

  const projectedPopulation = historicalPopulation.slice(-1).concat(
    data
      .filter((d) => d.simulationTag === "BASELINE")
      .map((d) => ({
        date: getRecordDate(d),
        value: d.totalPopulation,
        lowerBound: d.totalPopulationMin,
        upperBound: d.totalPopulationMax,
      }))
  );

  const uncertainty = [
    historicalPopulation[historicalPopulation.length - 1],
    ...data
      .filter((d) => d.simulationTag !== "HISTORICAL")
      .map((d) => ({ date: getRecordDate(d), value: d.totalPopulationMax })),
    ...data
      .filter((d) => d.simulationTag !== "HISTORICAL")
      .map((d) => ({ date: getRecordDate(d), value: d.totalPopulationMin }))
      .reverse(),
    historicalPopulation[historicalPopulation.length - 1],
  ];

  return { historicalPopulation, projectedPopulation, uncertainty };
};

export const getDateRange = (
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

export const formatMonthAndYear = (date: Date): string => {
  return formatDate(date, "MMM ''yy");
};

export const getChartTop = (plotLine: ChartPoint[]): number => {
  // Dynamically chose the top of the chart such that there should be a horizonal rule
  // at the very top for visual separation
  const maxValue = Math.max(...plotLine.map((d) => d.upperBound ?? d.value));

  let spacing;

  if (maxValue < 200) {
    spacing = 20;
  } else if (maxValue < 1000) {
    spacing = 100;
  } else if (maxValue < 2000) {
    spacing = 200;
  } else if (maxValue < 5000) {
    spacing = 500;
  } else if (maxValue < 10000) {
    spacing = 1000;
  } else {
    spacing = 2000;
  }

  return (Math.ceil(maxValue / spacing) + 1) * spacing;
};
