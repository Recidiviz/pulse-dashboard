const { query, param } = require("express-validator");

const VALID_STATE_CODES = ["US_PA", "US_MO"];
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
  param("stateCode").isIn(VALID_STATE_CODES),
  query("district").exists(),
  query("chargeCategory").isIn(CHARGE_CATEGORIES),
  query("metricPeriodMonths").isIn(METRIC_PERIOD_MONTHS),
  query("reportedViolations").isIn(REPORTED_VIOLATIONS),
  query("supervisionLevel").isIn(SUPERVISION_LEVELS),
  query("supervisionType").isIn(SUPERVISION_TYPES),
  query("violationType").isIn(VIOLATION_TYPES),
];

module.exports = { newRevocationsParamValidations };
