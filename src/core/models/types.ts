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
/**
 * All data comes back from the server as string values;
 * it will be up to us to cast those strings to other types as needed
 */
export type ApiData = {
  data: RawMetricData;
  metadata: Record<string, string>;
};

export type RawApiData = Record<string, ApiData>;
export type RawMetricData = Record<string, string>[];

export const TenantIdList = ["US_ND"] as const;

export type TenantId = typeof TenantIdList[number];
export type Gender = "ALL" | "FEMALE" | "MALE";
export type SimulationCompartment = "SUPERVISION" | "INCARCERATION";

export type PopulationProjectionSummaryRecords = (
  | HistoricalSummaryRecord
  | ProjectedSummaryRecord
)[];

export type ProjectedSummaryRecord = HistoricalSummaryRecord & {
  admissionCountMin: number;
  admissionCountMax: number;
  releaseCountMin: number;
  releaseCountMax: number;
  totalPopulationCountMin: number;
  totalPopulationCountMax: number;
};

export type HistoricalSummaryRecord = {
  timePeriod?: string;
  compartment?: string;
  legalStatus?: string;
  gender?: string;
  simulationTag?: string;
  admissionCount: number;
  releaseCount: number;
  totalPopulation: number;
  admissionPercentChange: number;
  releasePercentChange: number;
  populationPercentChange: number;
};

export type PopulationProjectionTimeseriesRecord = {
  year: number;
  month: number;
  compartment: SimulationCompartment;
  legalStatus: string;
  gender: Gender;
  simulationTag: string;
  totalPopulation: number;
  totalPopulationMax: number;
  totalPopulationMin: number;
};
