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
import { SummaryCard, SummaryStatus } from "./types";
import { VitalsSummaryRecord } from "../models/types";

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
    id: 1,
  },
  {
    title: "Timely discharge",
    description: `of clients were discharged at their earliest projected regular
     supervision discharge date`,
    value: summary.timelyDischarge,
    status: getSummaryStatus(summary.timelyDischarge),
    id: 2,
  },
  {
    title: "Timely FTR enrollment",
    description:
      "of clients are not pending enrollment in Free Through Recovery",
    value: summary.timelyFtrEnrollment,
    status: getSummaryStatus(summary.timelyFtrEnrollment),
    id: 3,
  },
  {
    title: "Timely contacts",
    description: `of clients received initial contact within 30 days of starting
     supervision and a F2F contact every subsequent 90, 60, or 30 days for 
     minimum, medium, and maximum supervision levels respectively`,
    value: summary.timelyContacts,
    status: getSummaryStatus(summary.timelyContacts),
    id: 4,
  },
  {
    title: "Timely risk assessments",
    description: `of clients have had an initial assessment within 30 days and 
      reassessment within 212 days`,
    value: summary.timelyRiskAssessments,
    status: getSummaryStatus(summary.timelyRiskAssessments),
    id: 5,
  },
];

export function getSummaryDetail(
  summaryCards: SummaryCard[],
  selectedCardId: number
): SummaryCard {
  return (
    summaryCards.find((card) => card.id === selectedCardId) || summaryCards[0]
  );
}
