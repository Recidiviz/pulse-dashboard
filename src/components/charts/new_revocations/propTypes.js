/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types";

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
