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
import map from "lodash/fp/map";
import flattenDeep from "lodash/fp/flattenDeep";

import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
} from "../../lantern/utils/constants";
import { US_MO, US_PA } from "./lanternTenants";

const METRIC_PERIODS = {
  options: [
    { value: "36", label: "3 years" },
    { value: "12", label: "1 year" },
    { value: "6", label: "6 months" },
    { value: "3", label: "3 months" },
    { value: "1", label: "1 month" },
  ],
  get defaultOption() {
    return this.options[1];
  },
  get defaultValue() {
    return this.defaultOption.value;
  },
};

export const SUPERVISION_LEVELS = {
  options: [
    { value: "All", label: "All" },
    { value: "ENHANCED", label: "Enhanced Supervision" },
    { value: "MAXIMUM", label: "Maximum Supervision" },
    { value: "MEDIUM", label: "Medium Supervision" },
    { value: "MINIMUM", label: "Minimum Supervision" },
    { value: "SPECIAL", label: "Special Circumstance Supervision" },
    { value: "ELECTRONIC_MONITORING_ONLY", label: "Monitored Supervision" },
  ],
  get defaultOption() {
    return this.options[0];
  },
  get defaultValue() {
    return this.defaultOption.value;
  },
};

const SUPERVISION_TYPES = {
  options: [
    { value: "All", label: "All" },
    { value: "PROBATION", label: "Probation" },
    { value: "PAROLE", label: "Parole" },
    { value: "DUAL", label: "Dual Supervision" },
  ],
  get defaultOption() {
    return this.options[0];
  },
  get defaultValue() {
    return this.defaultOption.value;
  },
};

export const ADMISSION_TYPES = {
  options: [
    { value: "All", label: "ALL" },
    { value: "LEGAL_REVOCATION", label: "Revocation" },
    {
      label: "SCI",
      allSelectedLabel: "All Short Term",
      options: [
        {
          value: "SHOCK_INCARCERATION_0_TO_6_MONTHS",
          label: "SCI < 6 months",
        },
        { value: "SHOCK_INCARCERATION_6_MONTHS", label: "SCI 6 months" },
        { value: "SHOCK_INCARCERATION_9_MONTHS", label: "SCI 9 months" },
        { value: "SHOCK_INCARCERATION_12_MONTHS", label: "SCI 12 months" },
      ],
    },
    { value: "SHOCK_INCARCERATION_PVC", label: "PVC" },
  ],
  get defaultOption() {
    return [this.options[0]];
  },
  get defaultValue() {
    return this.defaultOption.map(({ value }) => value);
  },
  get summingOption() {
    return this.options[0];
  },
  get flattenedOptions() {
    const options = flattenDeep(
      map("options", ADMISSION_TYPES.options).filter(Boolean)
    );
    return [...this.options, ...options];
  },
};

const MOFilterOptions = {
  [ADMISSION_TYPE]: {
    options: [{ value: "All", label: "ALL" }],
    get defaultOption() {
      return [this.options[0]];
    },
    get defaultValue() {
      return this.defaultOption.map(({ value }) => value);
    },
    get summingOption() {
      return this.options[0];
    },
    componentEnabled: false,
  },
  [CHARGE_CATEGORY]: {
    options: [
      { value: "All", label: "All" },
      { value: "GENERAL", label: "General" },
      { value: "SEX_OFFENSE", label: "Sex Offense" },
      { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
      { value: "SERIOUS_MENTAL_ILLNESS", label: "Serious Mental Illness" },
    ],
    get defaultOption() {
      return this.options[0];
    },
    get defaultValue() {
      return this.defaultOption.value;
    },
    componentEnabled: true,
  },
  [VIOLATION_TYPE]: {
    options: [
      { key: "travel_count", label: "Travel", type: "TECHNICAL" },
      { key: "residency_count", label: "Residency", type: "TECHNICAL" },
      { key: "employment_count", label: "Employment", type: "TECHNICAL" },
      { key: "association_count", label: "Association", type: "TECHNICAL" },
      {
        key: "directive_count",
        label: "Report / Directives",
        type: "TECHNICAL",
      },
      {
        key: "supervision_strategy_count",
        label: "Supervision Strategies",
        type: "TECHNICAL",
      },
      {
        key: "intervention_fee_count",
        label: "Intervention Fees",
        type: "TECHNICAL",
      },
      { key: "special_count", label: "Special Conditions", type: "TECHNICAL" },
      { key: "weapon_count", label: "Weapons", type: "TECHNICAL" },
      { key: "substance_count", label: "Substance Use", type: "TECHNICAL" },
      { key: "municipal_count", label: "Municipal", type: "LAW" },
      { key: "absconded_count", label: "Absconsion", type: "TECHNICAL" },
      { key: "misdemeanor_count", label: "Misdemeanor", type: "LAW" },
      { key: "felony_count", label: "Felony", type: "LAW" },
    ],
    defaultValue: "All",
  },
  [METRIC_PERIOD_MONTHS]: METRIC_PERIODS,
  [SUPERVISION_LEVEL]: { ...SUPERVISION_LEVELS, componentEnabled: false },
  [SUPERVISION_TYPE]: { ...SUPERVISION_TYPES, componentEnabled: true },
  [REPORTED_VIOLATIONS]: { defaultValue: "All" },
  [LEVEL_1_SUPERVISION_LOCATION]: { defaultValue: "All" },
  [LEVEL_2_SUPERVISION_LOCATION]: { defaultValue: "All" },
};

const PAFilterOptions = {
  [ADMISSION_TYPE]: { ...ADMISSION_TYPES, componentEnabled: true },
  [CHARGE_CATEGORY]: { defaultValue: "All", componentEnabled: false },
  [VIOLATION_TYPE]: {
    options: [
      { key: "low_tech_count", label: "Low tech.", type: "TECHNICAL" },
      { key: "med_tech_count", label: "Med tech.", type: "TECHNICAL" },
      {
        key: "elec_monitoring_count",
        label: "Elec. monitoring",
        type: "TECHNICAL",
      },
      { key: "substance_count", label: "Subs. use", type: "TECHNICAL" },
      { key: "absconded_count", label: "Absconsion", type: "TECHNICAL" },
      { key: "high_tech_count", label: "High tech.", type: "TECHNICAL" },
      { key: "law_count", label: "Law", type: "LAW" },
    ],
    defaultValue: "All",
  },
  [METRIC_PERIOD_MONTHS]: METRIC_PERIODS,
  [SUPERVISION_LEVEL]: { ...SUPERVISION_LEVELS, componentEnabled: true },
  [SUPERVISION_TYPE]: { defaultValue: "All", componentEnabled: false },
  [REPORTED_VIOLATIONS]: { defaultValue: "All" },
  [LEVEL_1_SUPERVISION_LOCATION]: { defaultValue: "All" },
  [LEVEL_2_SUPERVISION_LOCATION]: { defaultValue: "All" },
};

export default {
  [US_MO]: MOFilterOptions,
  [US_PA]: PAFilterOptions,
};
