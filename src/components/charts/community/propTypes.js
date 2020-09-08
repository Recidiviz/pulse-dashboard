/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types";

export const officeDataPropTypes = PropTypes.shape({
  district: PropTypes.number,
  lat: PropTypes.number,
  long: PropTypes.number,
  site_name: PropTypes.string,
  state_code: PropTypes.string,
  title_side: PropTypes.string,
});
