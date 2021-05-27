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
import { DownloadableData, DownloadableDataset } from "./types";
import {
  SummaryCard,
  METRIC_TYPES,
  METRIC_TYPE_LABELS,
  MetricType,
  ENTITY_TYPES,
  VitalsTimeSeriesRecord,
  VitalsSummaryTableRow,
} from "../models/types";
import { formatPercent } from "../../utils/formatStrings";

export function getSummaryDetail(
  summaryCards: SummaryCard[],
  selectedCardId: string
): SummaryCard {
  return (
    summaryCards.find((card) => card.id === selectedCardId) || summaryCards[0]
  );
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
  const ninetyDaysAgo = timeSeries[timeSeries.length - 89];
  const thirtyDaysAgo = timeSeries[timeSeries.length - 29];
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
        "30D average": formatPercent(d.monthlyAvg),
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
      "30D change": formatPercent(d.overall30Day),
      "90D change": formatPercent(d.overall90Day),
      [METRIC_TYPE_LABELS.DISCHARGE]: formatPercent(d.timelyDischarge),
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
