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
} from "./types";
import { VitalsSummaryRecord, VitalsTimeSeriesRecord } from "../models/types";

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
    title: "Overall",
    description: "Average timeliness across all metrics",
    value: summary.overall,
    status: getSummaryStatus(summary.overall),
    id: METRIC_TYPES.OVERALL,
  },
  {
    title: "Timely discharge",
    description: `of clients were discharged at their earliest projected regular
     supervision discharge date`,
    value: summary.timelyDischarge,
    status: getSummaryStatus(summary.timelyDischarge),
    id: METRIC_TYPES.DISCHARGE,
  },
  {
    title: "Timely FTR enrollment",
    description:
      "of clients are not pending enrollment in Free Through Recovery",
    value: summary.timelyFtrEnrollment,
    status: getSummaryStatus(summary.timelyFtrEnrollment),
    id: METRIC_TYPES.FTR_ENROLLMENT,
  },
  {
    title: "Timely contacts",
    description: `of clients received initial contact within 30 days of starting
     supervision and a F2F contact every subsequent 90, 60, or 30 days for 
     minimum, medium, and maximum supervision levels respectively`,
    value: summary.timelyContact,
    status: getSummaryStatus(summary.timelyContact),
    id: METRIC_TYPES.CONTACT,
  },
  {
    title: "Timely risk assessments",
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

export function getTimeseries(
  timeSeries: VitalsTimeSeriesRecord[],
  selectedCardId: string,
  currentEntityId: string
): VitalsTimeSeriesRecord[] | undefined {
  const selectedTimeSeries = timeSeries.filter(
    (d) => d.metric === selectedCardId && d.entityId === currentEntityId
  );
  return selectedTimeSeries.length > 0 ? selectedTimeSeries : undefined;
}

export function getMonthlyChange(
  timeSeries: VitalsTimeSeriesRecord[]
): { thirtyDayChange: number; ninetyDayChange: number } {
  const ninetyDaysAgo = timeSeries[0];
  // TODO update when there is data
  const thirtyDaysAgo = timeSeries[timeSeries.length - 27];
  const latestDay = timeSeries[timeSeries.length - 1];
  const thirtyDayChange = latestDay.monthlyAvg - thirtyDaysAgo.monthlyAvg;
  const ninetyDayChange = latestDay.monthlyAvg - ninetyDaysAgo.monthlyAvg;
  return { thirtyDayChange, ninetyDayChange };
}
