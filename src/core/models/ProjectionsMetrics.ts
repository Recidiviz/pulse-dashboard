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
import { computed, makeObservable } from "mobx";
import {
  Gender,
  PopulationProjectionSummaryRecords,
  PopulationProjectionTimeSeriesRecord,
  RawMetricData,
  SimulationCompartment,
} from "./types";
import { getCompartmentFromView } from "../views";
import Metric, { BaseMetricProps } from "./Metric";
import {
  MonthOptions,
  getRecordDate,
} from "../PopulationTimeSeriesChart/helpers";

export function recordMatchesSimulationTag(
  simulationTag: string
): (record: PopulationProjectionSummaryRecords[number]) => boolean {
  return (record) => record.simulationTag === simulationTag;
}

export function createProjectionSummaries(
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

export function createProjectionTimeSeries(
  rawRecords: RawMetricData
): PopulationProjectionTimeSeriesRecord[] {
  return rawRecords.map((record) => {
    return {
      year: Number(record.year),
      month: Number(record.month),
      compartment: record.compartment as SimulationCompartment,
      legalStatus: record.legal_status,
      gender: record.gender as Gender,
      simulationTag: record.simulation_tag,
      totalPopulation: Number(record.total_population),
      totalPopulationMax: Number(record.total_population_max),
      totalPopulationMin: Number(record.total_population_min),
    };
  });
}

type MetricRecords =
  | PopulationProjectionSummaryRecords
  | PopulationProjectionTimeSeriesRecord;

export default class ProjectionsMetrics extends Metric<MetricRecords> {
  constructor(props: BaseMetricProps) {
    super(props);
    makeObservable(this, {
      timeSeries: computed,
      summaries: computed,
      filteredCommunityTimeSeries: computed,
      filteredFacilitiesTimeSeries: computed,
    });
  }

  filterTimeSeriesData(
    records: PopulationProjectionTimeSeriesRecord[],
    compartment: string
  ): PopulationProjectionTimeSeriesRecord[] {
    if (!this.rootStore || !records.length) return records;
    const {
      gender,
      supervisionType,
      legalStatus,
      timePeriod,
    } = this.rootStore.filtersStore.filters;
    const monthRange: MonthOptions = parseInt(timePeriod) as MonthOptions;
    const range = monthRange === 1 ? 6 : monthRange;
    const status =
      compartment === "SUPERVISION" ? supervisionType : legalStatus;
    const stepSize = range / 6;

    const { simulationDate } = this;
    return records.filter((record: PopulationProjectionTimeSeriesRecord) => {
      const monthsOut =
        (record.year - simulationDate.getFullYear()) * 12 +
        (record.month - (simulationDate.getMonth() + 1));
      return (
        record.gender === gender &&
        record.compartment === compartment &&
        record.legalStatus === status &&
        Math.abs(monthsOut) <= range &&
        monthsOut % stepSize === 0
      );
    });
  }

  get filteredCommunityTimeSeries(): PopulationProjectionTimeSeriesRecord[] {
    return this.filterTimeSeriesData(this.timeSeries, "SUPERVISION");
  }

  get filteredFacilitiesTimeSeries(): PopulationProjectionTimeSeriesRecord[] {
    return this.filterTimeSeriesData(this.timeSeries, "INCARCERATION");
  }

  getFilteredDataByView(view: string): PopulationProjectionTimeSeriesRecord[] {
    const compartment = getCompartmentFromView(view);
    switch (compartment) {
      case "SUPERVISION":
        return this.filteredCommunityTimeSeries;
      case "INCARCERATION":
        return this.filteredFacilitiesTimeSeries;
      default:
        return this.timeSeries;
    }
  }

  get summaries(): PopulationProjectionSummaryRecords {
    if (!this.apiData) return [];
    return createProjectionSummaries(
      this.apiData.population_projection_summaries
    );
  }

  get timeSeries(): PopulationProjectionTimeSeriesRecord[] {
    if (!this.apiData) return [];
    const timeSeries = createProjectionTimeSeries(
      this.apiData.population_projection_timeseries
    );
    // TODO(recidiviz-data/issues/6651): Sort data on backend
    return timeSeries.sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.month - b.month
    );
  }

  get simulationDate(): Date {
    const { timeSeries } = this;

    if (timeSeries.length === 0) {
      return new Date(9999, 11, 31);
    }

    return getRecordDate(
      timeSeries.filter((d) => d.simulationTag === "HISTORICAL").slice(-1)[0]
    );
  }
}
