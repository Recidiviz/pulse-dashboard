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

import {
  Gender,
  PopulationProjectionTimeseriesRecord,
  SimulationCompartment,
} from "../models/types";

export const CURRENT_YEAR = 2021;
export const CURRENT_MONTH = 1;

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

export const filterData = (
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

const getDate = (d: PopulationProjectionTimeseriesRecord): Date =>
  new Date(d.year, d.month - 1);

export const prepareData = (
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
      .filter((d) => d.simulationTag === "BASELINE")
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
