import React from "react";
import PropTypes from "prop-types";
import { optionPropType } from "../../propTypes";

const GroupHeading = ({
  children: label,
  selectProps: { options, value: previousOptions },
  onChange,
}) => {
  const groupOptions = options.find((o) => o.label === label).options;

  const getIsOptionSelected = (option) =>
    previousOptions.some(({ value }) => value === option.value);

  const isAllOptionsSelected = groupOptions.every(getIsOptionSelected);

  const onClick = () => {
    if (isAllOptionsSelected) {
      const newOptions = previousOptions.filter(
        (previousOption) =>
          !groupOptions.some(({ value }) => value === previousOption.value)
      );

      onChange(newOptions);
    } else {
      const newOptions = previousOptions.concat(
        groupOptions.filter((option) => !getIsOptionSelected(option))
      );

      onChange(newOptions);
    }
  };

  return (
    <div className="MultiSelect__group-heading">
      <label className="MultiSelect__checkbox-container" onClick={onClick}>
        {label}
        <input
          className="MultiSelect__checkbox-input"
          type="checkbox"
          checked={isAllOptionsSelected}
          disabled
        />
        <span className="MultiSelect__checkbox" />
      </label>
    </div>
  );
};

GroupHeading.propTypes = {
  children: PropTypes.node.isRequired,
  selectProps: PropTypes.shape({
    options: PropTypes.arrayOf(optionPropType),
    value: PropTypes.arrayOf(optionPropType),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GroupHeading;
