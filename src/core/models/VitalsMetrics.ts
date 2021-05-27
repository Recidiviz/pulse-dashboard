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
import { action, autorun, computed, makeObservable, observable } from "mobx";
import {
  VitalsSummaryRecord,
  VitalsTimeSeriesRecord,
  RawMetricData,
  EntityType,
  VitalsSummaryTableRow,
  METRIC_TYPE_LABELS,
  SummaryCard,
  METRIC_TYPES,
  SummaryStatus,
  ENTITY_TYPES,
} from "./types";
import { toTitleCase } from "../../utils/formatStrings";
import Metric, { BaseMetricProps } from "./Metric";
import { parseResponseByFileFormat } from "../../api/metrics";

export const DEFAULT_ENTITY_ID = "STATE_DOC";

export function getSummaryStatus(value: number): SummaryStatus {
  if (value < 70) return "POOR";
  if (value >= 70 && value < 80) return "NEEDS_IMPROVEMENT";
  if (value >= 80 && value < 90) return "GOOD";
  if (value >= 90 && value < 95) return "GREAT";
  return "EXCELLENT";
}

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
  currentEntityId: string;

  summaries: VitalsSummaryRecord[];

  timeSeries: VitalsTimeSeriesRecord[];

  constructor(props: BaseMetricProps) {
    super(props);
    makeObservable(this, {
      buildSummaries: action,
      buildTimeSeries: action,
      currentEntitySummary: computed,
      childEntitySummaryRows: computed,
      parentEntityName: computed,
      summaryCards: computed,
      vitalsFiltersText: computed,
      currentEntityId: observable,
      summaries: observable.ref,
      timeSeries: observable.ref,
    });

    this.currentEntityId = DEFAULT_ENTITY_ID;
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

  get currentEntitySummary(): VitalsSummaryRecord | undefined {
    return this.summaries.find((d) => d.entityId === this.currentEntityId);
  }

  get summaryCards(): SummaryCard[] {
    if (this.currentEntitySummary === undefined) return [];

    const summary = this.currentEntitySummary;
    return [
      {
        title: METRIC_TYPE_LABELS.OVERALL,
        description: "Average timeliness across all metrics",
        value: summary.overall,
        status: getSummaryStatus(summary.overall),
        id: METRIC_TYPES.OVERALL,
      },
      {
        title: METRIC_TYPE_LABELS.DISCHARGE,
        description: `of clients were discharged at their earliest projected regular
         supervision discharge date`,
        value: summary.timelyDischarge,
        status: getSummaryStatus(summary.timelyDischarge),
        id: METRIC_TYPES.DISCHARGE,
      },
      {
        title: METRIC_TYPE_LABELS.CONTACT,
        description: `of clients received initial contact within 30 days of starting
         supervision and a F2F contact every subsequent 90, 60, or 30 days for 
         minimum, medium, and maximum supervision levels respectively`,
        value: summary.timelyContact,
        status: getSummaryStatus(summary.timelyContact),
        id: METRIC_TYPES.CONTACT,
      },
      {
        title: METRIC_TYPE_LABELS.RISK_ASSESSMENT,
        description: `of clients have had an initial assessment within 30 days and 
          reassessment within 212 days`,
        value: summary.timelyRiskAssessment,
        status: getSummaryStatus(summary.timelyRiskAssessment),
        id: METRIC_TYPES.RISK_ASSESSMENT,
      },
    ];
  }

  get childEntitySummaryRows(): VitalsSummaryTableRow[] {
    return this.summaries
      .filter(
        (d) =>
          d.parentEntityId === this.currentEntityId &&
          d.parentEntityId !== d.entityId
      )
      .map((d) => {
        const { entityId, entityName, entityType, ...attrs } = d;
        return {
          entity: {
            entityId,
            entityName,
            entityType,
          },
          ...attrs,
        };
      });
  }

  get parentEntityName(): string | undefined {
    return this.summaries.find(
      (d) => d.entityId === this.currentEntitySummary?.parentEntityId
    )?.entityName;
  }

  get vitalsFiltersText(): string {
    let offices;
    let officers;
    if (this.currentEntitySummary === undefined) return "";

    switch (this.currentEntitySummary.entityType) {
      case ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION:
        offices = this.currentEntitySummary.entityName;
        officers =
          this.childEntitySummaryRows &&
          this.childEntitySummaryRows
            .map((child) => child.entity.entityName)
            .join(", ");
        break;
      case ENTITY_TYPES.PO:
        offices = this.parentEntityName;
        officers = this.currentEntitySummary.entityName;
        break;
      default:
        offices = "All";
        officers = "All";
    }
    return `Office(s): ${offices}, Officers: ${officers}`;
  }
}
