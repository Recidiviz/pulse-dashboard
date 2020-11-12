import PropTypes from "prop-types";
import { METRIC_TYPES } from "../constants";

export const metricTypePropType = PropTypes.oneOf([
  METRIC_TYPES.RATES,
  METRIC_TYPES.COUNTS,
]);

export const filtersPropTypes = PropTypes.shape({
  metricPeriodMonths: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  chargeCategory: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
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
