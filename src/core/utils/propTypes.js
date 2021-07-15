import PropTypes from "prop-types";

import { METRIC_TYPES } from "./constants";

export const metricTypePropType = PropTypes.oneOf([
  METRIC_TYPES.RATES,
  METRIC_TYPES.COUNTS,
]);

export const officeDataPropTypes = PropTypes.shape({
  district: PropTypes.number,
  lat: PropTypes.number,
  long: PropTypes.number,
  site_name: PropTypes.string,
  state_code: PropTypes.string,
  title_side: PropTypes.string,
});
