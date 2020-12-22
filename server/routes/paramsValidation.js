const { query, param } = require("express-validator");
const { default: isDemoMode } = require("../utils/isDemoMode");

const VALID_STATE_CODES = ["US_PA", "US_MO"].concat(
  isDemoMode ? ["US_DEMO"] : []
);
const CHARGE_CATEGORIES = [
  "alcohol_drug",
  "all",
  "domestic_violence",
  "general",
  "serious_mental_illness",
  "sex_offense",
];
const METRIC_PERIOD_MONTHS = ["12", "3", "36", "6"];
const REPORTED_VIOLATIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "all"];
const SUPERVISION_LEVELS = [
  "all",
  "electronic_monitoring_only",
  "enhanced",
  "high",
  "incarcerated",
  "maximum",
  "medium",
  "minimum",
  "special",
];
const SUPERVISION_TYPES = ["all", "dual", "parole", "probation"];
const VIOLATION_TYPES = [
  "absconded",
  "all",
  "elec_monitoring",
  "escaped",
  "felony",
  "high_tech",
  "law",
  "low_tech",
  "med_tech",
  "misdemeanor",
  "municipal",
  "no_violations",
  "substance_abuse",
  "technical",
];

const newRevocationsParamValidations = [
  param("stateCode").toUpperCase().isIn(VALID_STATE_CODES),
  query("district").exists(),
  query("chargeCategory").toLowerCase().isIn(CHARGE_CATEGORIES),
  query("metricPeriodMonths").toLowerCase().isIn(METRIC_PERIOD_MONTHS),
  query("reportedViolations").toLowerCase().isIn(REPORTED_VIOLATIONS),
  query("supervisionLevel").toLowerCase().isIn(SUPERVISION_LEVELS),
  query("supervisionType").toLowerCase().isIn(SUPERVISION_TYPES),
  query("violationType").toLowerCase().isIn(VIOLATION_TYPES),
];

module.exports = { newRevocationsParamValidations };
