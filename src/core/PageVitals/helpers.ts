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
  SummaryCard,
  SummaryStatus,
  VitalsSummaryTableRow,
  METRIC_TYPES,
  METRIC_TYPE_LABELS,
  MetricType,
  DownloadableData,
  DownloadableDataset,
} from "./types";
import {
  ENTITY_TYPES,
  VitalsSummaryRecord,
  VitalsTimeSeriesRecord,
} from "../models/types";
import { formatPercent } from "../../utils/formatStrings";

export function getSummaryStatus(value: number): SummaryStatus {
  if (value < 70) return "POOR";
  if (value >= 70 && value < 80) return "NEEDS_IMPROVEMENT";
  if (value >= 80 && value < 90) return "GOOD";
  if (value >= 90 && value < 95) return "GREAT";
  return "EXCELLENT";
}

export const getSummaryCards: (
  summary: VitalsSummaryRecord
) => SummaryCard[] = (summary) => [
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
    title: METRIC_TYPE_LABELS.FTR_ENROLLMENT,
    description:
      "of clients are not pending enrollment in Free Through Recovery",
    value: summary.timelyFtrEnrollment,
    status: getSummaryStatus(summary.timelyFtrEnrollment),
    id: METRIC_TYPES.FTR_ENROLLMENT,
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

export function getSummaryDetail(
  summaryCards: SummaryCard[],
  selectedCardId: string
): SummaryCard {
  return (
    summaryCards.find((card) => card.id === selectedCardId) || summaryCards[0]
  );
}

export function getEntitySummaries(
  vitalsSummaries: VitalsSummaryRecord[],
  currentEntityId: string
): {
  currentEntitySummary: VitalsSummaryRecord;
  childEntitySummaryRows: VitalsSummaryTableRow[];
  parentEntityName?: string;
} {
  const currentEntitySummary = vitalsSummaries.find(
    (d) => d.entityId === currentEntityId
  ) as VitalsSummaryRecord;
  const childEntitySummaryRows = vitalsSummaries
    .filter(
      (d) =>
        d.parentEntityId === currentEntityId && d.parentEntityId !== d.entityId
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
    }) as VitalsSummaryTableRow[];
  const parentEntityName = vitalsSummaries.find(
    (d) => d.entityId === currentEntitySummary.parentEntityId
  )?.entityName;
  return { currentEntitySummary, childEntitySummaryRows, parentEntityName };
}

export function getTimeSeries(
  timeSeries: VitalsTimeSeriesRecord[],
  currentEntityId: string,
  selectedCardId?: string | undefined
): VitalsTimeSeriesRecord[] | undefined {
  const selectedTimeSeries = timeSeries
    .filter((d) =>
      selectedCardId
        ? d.metric === selectedCardId && d.entityId === currentEntityId
        : d.entityId === currentEntityId
    )
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  return selectedTimeSeries.length > 0 ? selectedTimeSeries : undefined;
}

export function getMonthlyChange(
  timeSeries: VitalsTimeSeriesRecord[]
): { thirtyDayChange: number; ninetyDayChange: number } {
  const ninetyDaysAgo = timeSeries[0];
  const thirtyDaysAgo = timeSeries[timeSeries.length - 27];
  const latestDay = timeSeries[timeSeries.length - 1];
  const thirtyDayChange = latestDay.monthlyAvg - thirtyDaysAgo.monthlyAvg;
  const ninetyDayChange = latestDay.monthlyAvg - ninetyDaysAgo.monthlyAvg;
  return { thirtyDayChange, ninetyDayChange };
}

export function getTimeSeriesDownloadableData(
  timeSeries?: VitalsTimeSeriesRecord[]
): DownloadableData | undefined {
  if (!timeSeries) return undefined;

  let labels = [] as string[];
  let ids = [] as string[];
  const datasets = [] as DownloadableDataset[];
  Object.values(METRIC_TYPES).forEach((metricType: MetricType) => {
    const metricData = timeSeries
      .filter((d: VitalsTimeSeriesRecord) => d.metric === metricType)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    labels = metricData.map((d) => d.date);
    ids = metricData.map((d) => d.entityId);
    const downloadableData = metricData.map((d: VitalsTimeSeriesRecord) => {
      return {
        Total: formatPercent(d.value),
        "7D average": formatPercent(d.monthlyAvg),
      };
    });
    datasets.push({
      data: downloadableData,
      label: METRIC_TYPE_LABELS[metricType],
    });
  });

  // add IDs to the beginning of the dataset
  datasets.unshift({ data: ids, label: "Id" });

  return {
    chartDatasets: datasets,
    chartLabels: labels,
    chartId: "MetricsOverTime",
    dataExportLabel: "Date",
  };
}

export function getVitalsSummaryDownloadableData(
  summaries: VitalsSummaryTableRow[]
): DownloadableData | undefined {
  if (summaries.length === 0) return undefined;

  const dataExportLabel =
    summaries[0].entity.entityType.toLowerCase() ===
    ENTITY_TYPES.PO.toLowerCase()
      ? "Officer"
      : "Office";

  const ids = summaries.map((d) => d.entity.entityName);
  const datasets = [] as DownloadableDataset[];
  const downloadableData = summaries.map((d: VitalsSummaryTableRow) => {
    return {
      "Overall score": formatPercent(d.overall),
      "7D change": formatPercent(d.overall30Day),
      "28D change": formatPercent(d.overall90Day),
      [METRIC_TYPE_LABELS.DISCHARGE]: formatPercent(d.timelyDischarge),
      [METRIC_TYPE_LABELS.FTR_ENROLLMENT]: formatPercent(d.timelyFtrEnrollment),
      [METRIC_TYPE_LABELS.CONTACT]: formatPercent(d.timelyContact),
      [METRIC_TYPE_LABELS.RISK_ASSESSMENT]: formatPercent(
        d.timelyRiskAssessment
      ),
    };
  });

  datasets.push({ data: downloadableData, label: "" });

  return {
    chartDatasets: datasets,
    chartLabels: ids,
    chartId: `MetricsBy${dataExportLabel}`,
    dataExportLabel,
  };
}

export const getVitalsFiltersText = (
  currentEntitySummary: VitalsSummaryRecord,
  children: VitalsSummaryTableRow[],
  parentEntityName: string | undefined
): string => {
  let offices;
  let officers;
  switch (currentEntitySummary.entityType) {
    case ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION:
      offices = currentEntitySummary.entityName;
      officers = children.map((child) => child.entity.entityName).join(", ");
      break;
    case ENTITY_TYPES.PO:
      offices = parentEntityName;
      officers = currentEntitySummary.entityName;
      break;
    default:
      offices = "All";
      officers = "All";
  }

  return `Office(s): ${offices}, Officers: ${officers}`;
};
