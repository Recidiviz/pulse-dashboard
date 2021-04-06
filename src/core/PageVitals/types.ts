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
import { EntityType } from "../models/types";

export type SummaryStatus =
  | "POOR"
  | "NEEDS_IMPROVEMENT"
  | "GOOD"
  | "GREAT"
  | "EXCELLENT";

export type SummaryCard = {
  id: MetricType;
  title: string;
  description: string;
  value: number;
  status: SummaryStatus;
};

export type VitalsSummaryTableRow = {
  entity: {
    entityId: string;
    entityName: string;
    entityType: EntityType;
  };
  parentEntityId?: string;
  overall: number;
  overall7Day: number;
  overall28Day: number;
  timelyDischarge: number;
  timelyFtrEnrollment: number;
  timelyContact: number;
  timelyRiskAssessment: number;
};

export type MetricType = keyof typeof METRIC_TYPES;
export const METRIC_TYPES = {
  OVERALL: "OVERALL",
  DISCHARGE: "DISCHARGE",
  FTR_ENROLLMENT: "FTR_ENROLLMENT",
  CONTACT: "CONTACT",
  RISK_ASSESSMENT: "RISK_ASSESSMENT",
} as const;