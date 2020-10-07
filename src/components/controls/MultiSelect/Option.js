import React from "react";
import PropTypes from "prop-types";
import { components } from "react-select";

const Option = ({ children, isSelected, ...props }) => (
  <components.Option isSelected={isSelected} {...props}>
    <label className="MultiSelect__checkbox-container">
      {children}
      <input
        className="MultiSelect__checkbox-input"
        type="checkbox"
        disabled
        checked={isSelected}
      />
      <span className="MultiSelect__checkbox" />
    </label>
  </components.Option>
);

Option.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Option;
