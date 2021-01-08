import PropTypes from "prop-types";
import { METRIC_TYPES } from "../constants";

export const metricTypePropType = PropTypes.oneOf([
  METRIC_TYPES.RATES,
  METRIC_TYPES.COUNTS,
]);

export const filtersPropTypes = PropTypes.shape({
  metricPeriodMonths: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  chargeCategory: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  supervisionType: PropTypes.string,
  reportedViolations: PropTypes.string.isRequired,
  violationType: PropTypes.string.isRequired,
  admissionType: PropTypes.arrayOf(PropTypes.string),
});

export const officeDataPropTypes = PropTypes.shape({
  district: PropTypes.number,
  lat: PropTypes.number,
  long: PropTypes.number,
  site_name: PropTypes.string,
  state_code: PropTypes.string,
  title_side: PropTypes.string,
});

const reportedViolationTypes = {
  1: PropTypes.number,
  2: PropTypes.number,
  3: PropTypes.number,
  4: PropTypes.number,
  5: PropTypes.number,
  6: PropTypes.number,
  7: PropTypes.number,
  8: PropTypes.number,
};

export const dataMatrixPropTypes = PropTypes.shape({
  ABSCONDED: PropTypes.shape(reportedViolationTypes),
  FELONY: PropTypes.shape(reportedViolationTypes),
  MISDEMEANOR: PropTypes.shape(reportedViolationTypes),
  MUNICIPAL: PropTypes.shape(reportedViolationTypes),
  SUBSTANCE_ABUSE: PropTypes.shape(reportedViolationTypes),
  TECHNICAL: PropTypes.shape(reportedViolationTypes),
});
