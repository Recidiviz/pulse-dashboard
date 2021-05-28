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

export const DEFAULT_ENTITY_ID = "STATE_DOC";
export const DEFAULT_ENTITY_TYPE = "state";
export const DEFAULT_ENTITY_NAME = "STATE DOC";

export type MetricType = keyof typeof METRIC_TYPES;
export const METRIC_TYPES = {
  OVERALL: "OVERALL",
  DISCHARGE: "DISCHARGE",
  CONTACT: "CONTACT",
  RISK_ASSESSMENT: "RISK_ASSESSMENT",
} as const;
export const METRIC_TYPE_LABELS = {
  OVERALL: "Overall",
  DISCHARGE: "Timely discharge",
  CONTACT: "Timely contacts",
  RISK_ASSESSMENT: "Timely risk assessments",
} as const;

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
  overall30Day: number;
  overall90Day: number;
  timelyDischarge: number;
  timelyContact: number;
  timelyRiskAssessment: number;
};

export type SummaryStatus =
  | "POOR"
  | "NEEDS_IMPROVEMENT"
  | "GOOD"
  | "GREAT"
  | "EXCELLENT";

export type DownloadableData =
  | {
      chartDatasets: DownloadableDataset[];
      chartLabels: string[];
      chartId: string;
      dataExportLabel: string;
    }
  | undefined;

export type DownloadableDataset = {
  data: any;
  label: string;
};
