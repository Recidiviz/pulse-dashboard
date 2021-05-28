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
import { action, autorun, makeObservable, observable } from "mobx";
import {
  VitalsSummaryRecord,
  VitalsTimeSeriesRecord,
  RawMetricData,
  EntityType,
} from "./types";
import { toTitleCase } from "../../utils/formatStrings";
import Metric, { BaseMetricProps } from "./Metric";
import { parseResponseByFileFormat } from "../../api/metrics";

export function createVitalsSummaryMetrics(
  rawRecords: RawMetricData
): VitalsSummaryRecord[] {
  return rawRecords.map((record) => {
    return {
      entityId: record.entity_id,
      entityName: toTitleCase(record.entity_name),
      entityType: record.entity_type.toUpperCase() as EntityType,
      parentEntityId: record.parent_entity_id,
      overall: Number(record.overall),
      timelyDischarge: Number(record.timely_discharge),
      timelyContact: Number(record.timely_contact),
      timelyRiskAssessment: Number(record.timely_risk_assessment),
      overall30Day: Number(record.overall_30d),
      overall90Day: Number(record.overall_90d),
    };
  });
}

export function createVitalsTimeSeriesMetrics(
  rawRecords: RawMetricData
): VitalsTimeSeriesRecord[] {
  return rawRecords.map((record) => {
    return {
      date: record.date,
      entityId: record.entity_id,
      metric: record.metric,
      value: Number(record.value),
      monthlyAvg: Number(record.avg_30d),
    };
  });
}

type MetricRecords = VitalsSummaryRecord | VitalsTimeSeriesRecord;

export default class VitalsMetrics extends Metric<MetricRecords> {
  summaries: VitalsSummaryRecord[];

  timeSeries: VitalsTimeSeriesRecord[];

  constructor(props: BaseMetricProps) {
    super(props);
    makeObservable(this, {
      buildSummaries: action,
      buildTimeSeries: action,
      summaries: observable.ref,
      timeSeries: observable.ref,
    });

    this.summaries = [];
    this.timeSeries = [];

    autorun(() => {
      if (this.apiData) {
        this.buildSummaries();
        this.buildTimeSeries();
      }
    });
  }

  buildSummaries(): void {
    const summaries = parseResponseByFileFormat(
      this.apiData,
      "vitals_summaries",
      this.eagerExpand
    );
    this.summaries = createVitalsSummaryMetrics(summaries.data);
  }

  buildTimeSeries(): void {
    const timeSeries = parseResponseByFileFormat(
      this.apiData,
      "vitals_time_series",
      this.eagerExpand
    );
    this.timeSeries = createVitalsTimeSeriesMetrics(timeSeries.data);
  }
}
