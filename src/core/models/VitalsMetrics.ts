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
  VitalsSummaryRecord,
  VitalsTimeSeriesRecord,
  RawMetricData,
  EntityType,
} from "./types";
import { toTitleCase } from "../../utils/formatStrings";
import Metric, { BaseMetricProps } from "./Metric";

export function createVitalsSummaryMetric(
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
      timelyFtrEnrollment: Number(record.timely_ftr_enrollment),
      timelyContact: Number(record.timely_contact),
      timelyRiskAssessment: Number(record.timely_risk_assessment),
      overall7Day: Number(record.overall_7d),
      overall28Day: Number(record.overall_28d),
    };
  });
}

export function createVitalsTimeSeriesMetric(
  rawRecords: RawMetricData
): VitalsTimeSeriesRecord[] {
  return rawRecords.map((record) => {
    return {
      date: record.date,
      entityId: record.entity_id,
      metric: record.metric,
      value: Number(record.value),
      weeklyAvg: Number(record.avg_7d),
    };
  });
}

type MetricRecords = VitalsSummaryRecord | VitalsTimeSeriesRecord;

export default class VitalsMetrics extends Metric<MetricRecords> {
  constructor(props: BaseMetricProps) {
    super(props);
    makeObservable(this, {
      timeSeries: computed,
      summaries: computed,
    });
  }

  get summaries(): VitalsSummaryRecord[] {
    if (!this.apiData) return [];
    return createVitalsSummaryMetric(this.apiData.vitals_summaries);
  }

  get timeSeries(): VitalsTimeSeriesRecord[] {
    if (!this.apiData) return [];
    return createVitalsTimeSeriesMetric(this.apiData.vitals_time_series);
  }
}