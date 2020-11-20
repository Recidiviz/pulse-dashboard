/* eslint-disable import/prefer-default-export, react/forbid-prop-types */
import PropTypes from "prop-types";

export const optionPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.any,
});
