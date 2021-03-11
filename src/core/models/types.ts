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
export type RawMetricData = Record<string, string>[];

export const TenantIdList = ["US_ND"] as const;

export type TenantId = typeof TenantIdList[number];

export type MetricTypeId = typeof MetricTypeIdList[number];

export const MetricTypeIdList = ["PopulationProjectionSummaryMetric"] as const;

export type MetricRecord = PopulationProjectionSummaryRecord;

export type PopulationProjectionSummaryRecord = {
  timePeriod?: number;
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
  admissionCountMin?: number;
  admissionCountMax?: number;
  releaseCountMin?: number;
  releaseCountMax?: number;
  totalPopulationCountMin?: number;
  totalPopulationCountMax?: number;
};
