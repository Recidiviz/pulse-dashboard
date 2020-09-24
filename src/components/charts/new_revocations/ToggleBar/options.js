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

export const CHARGE_CATEGORIES = [
  { value: "All", label: "All" },
  { value: "GENERAL", label: "General" },
  { value: "SEX_OFFENDER", label: "Sex Offense" },
  { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
  { value: "SERIOUS_MENTAL_ILLNESS", label: "Serious Mental Illness" },
];

export const SUPERVISION_TYPES = [
  { value: "All", label: "All" },
  { value: "PROBATION", label: "Probation" },
  { value: "PAROLE", label: "Parole" },
  { value: "DUAL", label: "Dual Supervision" },
];

export const SUPERVISION_LEVELS = [
  { value: "All", label: "All" },
  { value: "ENHANCED", label: "Enhanced Supervision" },
  { value: "MAXIMUM", label: "Maximum Supervision" },
  { value: "MEDIUM", label: "Medium Supervision" },
  { value: "MINIMUM", label: "Minimum Supervision" },
  { value: "SPECIAL_CIRCUMSTANCE", label: "Special Circumstance Supervision" },
  { value: "MONITORED", label: "Monitored Supervision" },
];

export const ADMISSION_TYPES = [
  { value: "All", label: "ALL" },
  { value: "REVOCATION", label: "Revocation" },
  {
    label: "SCI",
    allSelectedLabel: "All Short Term",
    options: [
      { value: "SCI_6", label: "SCI 6 months" },
      { value: "SCI_9", label: "SCI 9 months" },
      { value: "SCI_12", label: "SCI 12 months" },
    ],
  },
  { value: "PVC", label: "PVC" },
  { value: "INPATIENT_DA", label: "Inpatient D&A" },
  { value: "DA_DETOX", label: "D&A Detox" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
];

export const DEFAULT_METRIC_PERIOD = METRIC_PERIODS[1];
export const DEFAULT_SUPERVISION_TYPE = SUPERVISION_TYPES[0];
export const DEFAULT_CHARGE_CATEGORY = CHARGE_CATEGORIES[0];
export const DEFAULT_ADMISSION_TYPE = ADMISSION_TYPES[0];
