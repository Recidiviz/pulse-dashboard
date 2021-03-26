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
  PopulationProjectionSummaryRecords,
  RawMetricData,
  SimulationCompartment,
} from "./types";

export function recordMatchesSimulationTag(
  simulationTag: string
): (record: PopulationProjectionSummaryRecords[number]) => boolean {
  return (record) => record.simulationTag === simulationTag;
}

export function populationProjectionSummary(
  rawRecords: RawMetricData
): PopulationProjectionSummaryRecords {
  return rawRecords.map((record) => {
    if (record.simulation_tag === "HISTORICAL") {
      return {
        simulationTag: record.simulation_tag,
        timePeriod: record.metric_period_months,
        compartment: record.compartment as SimulationCompartment,
        legalStatus: record.legal_status,
        gender: record.simulation_group as Gender,
        admissionCount: Number(record.admission_count),
        releaseCount: Number(record.release_count),
        totalPopulation: Number(record.total_population),
        admissionPercentChange: Number(record.admission_percent_change),
        releasePercentChange: Number(record.release_percent_change),
        populationPercentChange: Number(record.population_percent_change),
      };
    }
    return {
      simulationTag: record.simulation_tag,
      timePeriod: record.metric_period_months,
      compartment: record.compartment as SimulationCompartment,
      legalStatus: record.legal_status,
      gender: record.simulation_group as Gender,
      admissionCount: Number(record.admission_count),
      releaseCount: Number(record.release_count),
      totalPopulation: Number(record.total_population),
      admissionPercentChange: Number(record.admission_percent_change),
      releasePercentChange: Number(record.release_percent_change),
      populationPercentChange: Number(record.population_percent_change),
      admissionCountMin: Number(record.admission_count_min),
      admissionCountMax: Number(record.admission_count_max),
      releaseCountMin: Number(record.release_count_min),
      releaseCountMax: Number(record.release_count_max),
      totalPopulationCountMin: Number(record.total_population_count_min),
      totalPopulationCountMax: Number(record.total_population_count_max),
    };
  });
}
