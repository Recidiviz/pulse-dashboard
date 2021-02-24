const { query, param, body } = require("express-validator");
const { default: isDemoMode } = require("../utils/isDemoMode");

const VALID_STATE_CODES = ["US_PA", "US_MO", "US_ND"].concat(
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
const METRIC_PERIOD_MONTHS = ["12", "3", "36", "6", "1"];
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
  "no_violation_type",
  "substance_abuse",
  "technical",
];

const newRevocationsParamValidations = [
  param("stateCode").toUpperCase().isIn(VALID_STATE_CODES),
  // TODO[#657]: Remove optional check for params when the FE starts sending the query
  query("district").optional(),
  query("levelOneSupervisionLocation").optional(),
  query("levelTwoSupervisionLocation").optional(),
  query("chargeCategory").toLowerCase().optional().isIn(CHARGE_CATEGORIES),
  query("metricPeriodMonths")
    .toLowerCase()
    .optional()
    .isIn(METRIC_PERIOD_MONTHS),
  query("reportedViolations")
    .toLowerCase()
    .optional()
    .isIn(REPORTED_VIOLATIONS),
  query("supervisionLevel").toLowerCase().optional().isIn(SUPERVISION_LEVELS),
  query("supervisionType").toLowerCase().optional().isIn(SUPERVISION_TYPES),
  query("violationType").toLowerCase().optional().isIn(VIOLATION_TYPES),
];

const restrictedAccessParamValidations = [
  body("userEmail", "Request is missing userEmail parameter").exists(),
];

module.exports = {
  newRevocationsParamValidations,
  restrictedAccessParamValidations,
};
