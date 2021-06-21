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
import { makeAutoObservable } from "mobx";
import type RootStore from ".";
import { formatISODateString, formatPercent } from "../../utils/formatStrings";
import {
  VitalsSummaryRecord,
  VitalsTimeSeriesRecord,
  ENTITY_TYPES,
} from "../models/types";
import {
  DownloadableData,
  DownloadableDataset,
  VitalsSummaryTableRow,
  METRIC_TYPE_LABELS,
  SummaryCard,
  METRIC_TYPES,
  SummaryStatus,
  MetricType,
  DEFAULT_ENTITY_ID,
  VitalsMetric,
} from "../PageVitals/types";
import TENANTS from "../../tenants";
import { downloadChartAsData } from "../../utils/downloads/downloadData";
import content from "../content";

export function getSummaryStatus(value: number): SummaryStatus {
  if (value < 70) return "POOR";
  if (value >= 70 && value < 80) return "NEEDS_IMPROVEMENT";
  if (value >= 80 && value < 90) return "GOOD";
  if (value >= 90 && value < 95) return "GREAT";
  return "EXCELLENT";
}

export default class PageVitalsStore {
  protected readonly rootStore;

  currentEntityId: string;

  selectedMetricId: MetricType;

  constructor({ rootStore }: { rootStore: RootStore }) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.currentEntityId = DEFAULT_ENTITY_ID;
    this.selectedMetricId = METRIC_TYPES.OVERALL;
    this.downloadDataZip = this.downloadDataZip.bind(this);
  }

  get summaries(): VitalsSummaryRecord[] {
    return this.rootStore.metricsStore.vitals.summaries;
  }

  get timeSeries(): VitalsTimeSeriesRecord[] {
    return this.rootStore.metricsStore.vitals.timeSeries;
  }

  setSelectedMetricId(metricId: MetricType): void {
    this.selectedMetricId = metricId;
  }

  get metrics(): VitalsMetric[] {
    const tenantId = this.rootStore.tenantStore.currentTenantId;
    if (!tenantId) return [] as VitalsMetric[];
    return TENANTS[tenantId].vitalsMetrics || ([] as VitalsMetric[]);
  }

  get currentEntitySummary(): VitalsSummaryRecord | undefined {
    return this.summaries.find((d) => d.entityId === this.currentEntityId);
  }

  get summaryCards(): SummaryCard[] {
    if (this.currentEntitySummary === undefined) return [] as SummaryCard[];

    const summary = this.currentEntitySummary;
    return this.metrics.map((m) => ({
      title: m.name,
      description: m.description,
      value: summary[m.accessor],
      status: getSummaryStatus(summary[m.accessor]),
      id: m.id,
    }));
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

  get parentEntityName(): string {
    return (
      this.summaries.find(
        (d) => d.entityId === this.currentEntitySummary?.parentEntityId
      )?.entityName || "Unknown"
    );
  }

  get selectedMetricTimeSeries(): VitalsTimeSeriesRecord[] | undefined {
    const selectedTimeSeries = this.currentEntityTimeSeries.filter(
      (d) => d.metric === this.selectedMetricId
    );
    return selectedTimeSeries.length > 0 ? selectedTimeSeries : undefined;
  }

  get currentEntityTimeSeries(): VitalsTimeSeriesRecord[] {
    const selectedTimeSeries = this.timeSeries.filter(
      (d) => d.entityId === this.currentEntityId
    );
    return selectedTimeSeries;
  }

  get lastUpdatedOn(): string {
    return this.selectedMetricTimeSeries
      ? formatISODateString(
          this.selectedMetricTimeSeries[
            this.selectedMetricTimeSeries.length - 1
          ].date
        )
      : "Unknown";
  }

  get filtersText(): string {
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

  get timeSeriesDownloadableData(): DownloadableData | undefined {
    if (!this.currentEntityTimeSeries) return undefined;

    let labels = [] as string[];
    let ids = [] as string[];
    const datasets = [] as DownloadableDataset[];
    Object.values(METRIC_TYPES).forEach((metricType: MetricType) => {
      const metricData = this.currentEntityTimeSeries.filter(
        (d: VitalsTimeSeriesRecord) => d.metric === metricType
      );
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

  get summaryDownloadableData(): DownloadableData | undefined {
    if (this.childEntitySummaryRows.length === 0) return undefined;

    const dataExportLabel =
      this.childEntitySummaryRows[0].entity.entityType.toLowerCase() ===
      ENTITY_TYPES.PO.toLowerCase()
        ? "Officer"
        : "Office";

    const ids = this.childEntitySummaryRows.map((d) => d.entity.entityName);
    const datasets = [] as DownloadableDataset[];
    const downloadableData = this.childEntitySummaryRows.map(
      (d: VitalsSummaryTableRow) => {
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
      }
    );

    datasets.push({ data: downloadableData, label: "" });

    return {
      chartDatasets: datasets,
      chartLabels: ids,
      chartId: `MetricsBy${dataExportLabel}`,
      dataExportLabel,
    };
  }

  get monthlyChange():
    | { thirtyDayChange: number; ninetyDayChange: number }
    | undefined {
    const timeSeries = this.selectedMetricTimeSeries;
    if (timeSeries === undefined) return undefined;

    const ninetyDaysAgo = timeSeries[timeSeries.length - 89];
    const thirtyDaysAgo = timeSeries[timeSeries.length - 29];
    const latestDay = timeSeries[timeSeries.length - 1];
    const thirtyDayChange = latestDay.monthlyAvg - thirtyDaysAgo.monthlyAvg;
    const ninetyDayChange = latestDay.monthlyAvg - ninetyDaysAgo.monthlyAvg;
    return { thirtyDayChange, ninetyDayChange };
  }

  get summaryDetail(): SummaryCard {
    return (
      this.summaryCards.find((card) => card.id === this.selectedMetricId) ||
      this.summaryCards[0]
    );
  }

  async downloadDataZip(): Promise<void> {
    if (!this.rootStore.currentTenantId) return;

    const { vitals: vitalsMethodology } = content[
      this.rootStore.currentTenantId
    ];
    return downloadChartAsData({
      fileContents: [
        this.timeSeriesDownloadableData,
        this.summaryDownloadableData,
      ],
      chartTitle: `${this.rootStore.tenantStore.stateName} At A Glance`,
      shouldZipDownload: true,
      methodology: vitalsMethodology.content,
      getTokenSilently: this.rootStore.userStore.getTokenSilently,
      filters: this.filtersText,
      lastUpdatedOn: this.lastUpdatedOn,
    });
  }
}
