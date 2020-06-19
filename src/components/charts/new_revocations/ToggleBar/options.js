// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

export const METRIC_PERIODS = [
  { value: "36", label: "3 years" },
  { value: "12", label: "1 year" },
  { value: "6", label: "6 months" },
  { value: "3", label: "3 months" },
  { value: "1", label: "1 month" },
];

export const DEFAULT_METRIC_PERIOD = "12";

export const DEFAULT_BASE_DISTRICT = { value: "All", label: "All districts" };

export const CHARGE_CATEGORIES = [
  { value: "All", label: "All" },
  { value: "GENERAL", label: "General" },
  { value: "SEX_OFFENDER", label: "Sex Offense" },
  { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
  { value: "SERIOUS_MENTAL_ILLNESS", label: "Serious Mental Illness" },
];

// TODO: Determine if we want to continue to explicitly provide charge_category=ALL or treat it
// like supervision type where ALL is a summation of other rows
export const DEFAULT_CHARGE_CATEGORY = "All";

export const SUPERVISION_TYPES = [
  { value: "All", label: "All" },
  { value: "PROBATION", label: "Probation" },
  { value: "PAROLE", label: "Parole" },
  { value: "DUAL", label: "Dual Supervision" },
];

export const DEFAULT_DISTRICT = "All";
export const DEFAULT_SUPERVISION_TYPE = "All";
