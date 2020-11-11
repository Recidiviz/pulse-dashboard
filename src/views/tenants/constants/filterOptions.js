import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../../../constants/filterTypes";
import { MO, PA } from "../utils/lanternTenants";

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

const MOFilterOptions = {
  [ADMISSION_TYPE]: {
    options: [
      { value: "All", label: "ALL" },
      { value: "REVOCATION", label: "Revocation" },
      {
        value: "INSTITUTIONAL TREATMENT",
        label: "Institutional Treatment",
      },
      { value: "BOARDS_RETURN", label: "Board Returns" },
    ],
    get defaultOption() {
      return [this.options[1]];
    },
    get defaultValue() {
      return this.defaultOption.map(({ value }) => value);
    },
    get summingOption() {
      return this.options[0];
    },
    // TODO(425): Set to true when we are ready to launch admission type filters for MO
    filterEnabled: false,
    componentEnabled: false,
  },
  // temporarily we will be accepting either SEX_OFFENSE or SEX_OFFENDER
  // in the charge_category field. Once the BE transition to SEX_OFFENSE
  // has been made, we will revert this to the single value
  [CHARGE_CATEGORY]: {
    options: [
      { value: "All", label: "All" },
      { value: "GENERAL", label: "General" },
      { value: ["SEX_OFFENSE", "SEX_OFFENDER"], label: "Sex Offense" },
      { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
      { value: "SERIOUS_MENTAL_ILLNESS", label: "Serious Mental Illness" },
    ],
    get defaultOption() {
      return this.options[0];
    },
    get defaultValue() {
      return this.defaultOption.value;
    },
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
    defaultValue: "",
  },
  [METRIC_PERIOD_MONTHS]: METRIC_PERIODS,
  [SUPERVISION_LEVEL]: { ...SUPERVISION_LEVELS, componentEnabled: false },
  [SUPERVISION_TYPE]: { ...SUPERVISION_TYPES, componentEnabled: true },
  [REPORTED_VIOLATIONS]: { defaultValue: "" },
  [DISTRICT]: { defaultValue: "All" },
};

const PAFilterOptions = {
  [ADMISSION_TYPE]: {
    options: [
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
    ],
    get defaultOption() {
      return [this.options[1]];
    },
    get defaultValue() {
      return this.defaultOption.map(({ value }) => value);
    },
    get summingOption() {
      return this.options[0];
    },
    // TODO(425): Set to true when we are ready to launch admission type filters for PA
    filterEnabled: false,
    componentEnabled: false,
  },
  // temporarily we will be accepting either SEX_OFFENSE or SEX_OFFENDER
  // in the charge_category field. Once the BE transition to SEX_OFFENSE
  // has been made, we will revert this to the single value
  [CHARGE_CATEGORY]: {
    options: [
      { value: "All", label: "All" },
      { value: "GENERAL", label: "General" },
      { value: ["SEX_OFFENSE", "SEX_OFFENDER"], label: "Sex Offense" },
      { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
      { value: "SERIOUS_MENTAL_ILLNESS", label: "Mental Health" },
      { value: "ALCOHOL_DRUG", label: "AOD" },
    ],
    get defaultOption() {
      return this.options[0];
    },
    get defaultValue() {
      return this.defaultOption.value;
    },
  },
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
    defaultValue: "",
  },
  [METRIC_PERIOD_MONTHS]: METRIC_PERIODS,
  [SUPERVISION_LEVEL]: { ...SUPERVISION_LEVELS, componentEnabled: true },
  [SUPERVISION_TYPE]: { defaultValue: "All", componentEnabled: false },
  [REPORTED_VIOLATIONS]: { defaultValue: "" },
  [DISTRICT]: { defaultValue: "All" },
};

export default {
  [MO]: MOFilterOptions,
  [PA]: PAFilterOptions,
};
