// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactSelect, { components } from "react-select";

import has from "lodash/fp/has";
import map from "lodash/fp/map";

import "./Select.scss";

export const getAllOptionsWithValue = (options, summingOption) => {
  const result = [];

  options.forEach((option) => {
    if (has("value", option) && summingOption.value !== option.value) {
      result.push(option);
    }
    if (has("options", option)) {
      option.options.forEach((o) => {
        if (has("value", o)) {
          result.push(o);
        }
      });
    }
  });

  return result;
};

export const formatSelectOptionValue = (
  allOptions,
  summingOption,
  selectedOptions,
  isShortFormat = true
) => {
  const selectedValues = map("value", selectedOptions);

  // show option label if only one selected
  if (selectedValues.length === 1) {
    const options = getAllOptionsWithValue(allOptions, summingOption);
    const option = options.find((o) => o.value === selectedValues[0]);
    return option ? option.label : "";
  }

  // show group label if all options in the only one group selected
  const selectedGroups = allOptions
    .filter((o) => o.options)
    .filter((group) =>
      group.options.every((o) => selectedValues.includes(o.value))
    );
  if (
    selectedGroups.length === 1 &&
    selectedGroups[0].options.length === selectedValues.length
  ) {
    return `${selectedGroups[0].label} - ${selectedGroups[0].allSelectedLabel}`;
  }

  if (isShortFormat) {
    return `${selectedOptions.length} Items selected`;
  }

  const groupOptions = getAllOptionsWithValue(selectedGroups, summingOption);
  const optionLabels = selectedOptions
    .filter(
      (option) =>
        !groupOptions.find((groupOption) => groupOption.value === option.value)
    )
    .map((option) => option.label);
  const groupLabels = map(
    (group) => `${group.label} - ${group.allSelectedLabel}`,
    selectedGroups
  );

  return optionLabels.concat(groupLabels).join(", ");
};

const onMultiChange = (allOptions, summingOption, handleChange) => (
  selectedOptions = []
) => {
  const options = getAllOptionsWithValue(allOptions, summingOption);
  const selectedValues = map("value", selectedOptions);

  const isNoOptionsSelected = selectedValues.length === 0;

  const isSummingOptionSelected =
    selectedValues.length > 1 &&
    selectedValues[selectedValues.length - 1] === summingOption.value;

  const isAllOptionsSelected = options.every((o) =>
    selectedValues.includes(o.value)
  );

  let updatedOptions = [];
  if (isNoOptionsSelected || isSummingOptionSelected || isAllOptionsSelected) {
    updatedOptions = [summingOption];
  } else if (
    selectedValues.length > 1 &&
    selectedValues.includes(summingOption.value)
  ) {
    updatedOptions = selectedOptions.filter(
      (o) => o.value !== summingOption.value
    );
  } else {
    updatedOptions = selectedOptions;
  }

  handleChange(updatedOptions.map((o) => ({ ...o, key: o.value })));
};

const GroupHeading = ({ onChange, ...props }) => {
  const {
    children: label,
    selectProps: { options, value },
  } = props;
  const groupOptions = options.find((o) => o.label === label).options;

  const isOptionSelected = (option) =>
    value.find((val) => val.value === option.value);

  const isAllOptionsSelected = groupOptions.every(isOptionSelected);

  const onClick = () => {
    let updatedOptions = [...value];

    if (isAllOptionsSelected) {
      groupOptions.forEach((option) => {
        updatedOptions = updatedOptions.filter(
          (updatedOption) => option.value !== updatedOption.value
        );
      });
    } else {
      updatedOptions = updatedOptions.concat(
        groupOptions.filter((option) => !isOptionSelected(option))
      );
    }

    onChange(updatedOptions);
  };

  return (
    <div onClick={onClick}>
      <label className="checkbox-container" style={{ marginLeft: -8 }}>
        {label}
        <input
          type="checkbox"
          checked={isAllOptionsSelected}
          onChange={() => null}
        />
        <span className="checkmark" />
      </label>
    </div>
  );
};

const ValueContainer = ({ allOptions, summingOption, children, ...props }) => {
  const { selectProps, getValue } = props;
  const values = getValue();

  const selectInput = React.Children.toArray(children).find(
    (input) => input.type.name === "Input" || input.type.name === "DummyInput"
  );

  const isAll =
    !selectProps.inputValue &&
    values.length === 1 &&
    summingOption &&
    values[0].value === summingOption.value;

  const text = isAll
    ? summingOption.label
    : formatSelectOptionValue(allOptions, summingOption, values);

  return (
    <components.ValueContainer {...props}>
      <>
        {text}
        {selectInput}
      </>
    </components.ValueContainer>
  );
};

const Option = (props) => {
  const { isSelected, children } = props;

  return (
    <components.Option {...props}>
      <label className="checkbox-container">
        {children}
        <input type="checkbox" checked={isSelected} onChange={() => null} />
        <span className="checkmark" />
      </label>
    </components.Option>
  );
};

const fontStyles = {
  color: "rgba(114, 119, 122, 0.8)",
  textTransform: "uppercase",
};

const defaultStyles = {
  option: (base, state) => ({
    ...base,
    ...fontStyles,
    backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    "&:active": {
      backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    },
  }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  group: (base) => ({ ...base, ...fontStyles, marginLeft: 20 }),
};

const Select = ({ summingOption, isMulti, ...props }) => {
  const { options } = props;
  const [value, setValue] = useState([summingOption]);

  const handleChange = (selectedOptions) => {
    props.onChange(selectedOptions);
    return setValue(selectedOptions);
  };

  const onChange = onMultiChange(options, summingOption, handleChange);

  if (isMulti) {
    return (
      <ReactSelect
        {...props}
        closeMenuOnSelect={false}
        components={{
          GroupHeading: (groupHeadingProps) => (
            <GroupHeading onChange={onChange} {...groupHeadingProps} />
          ),
          Option,
          ValueContainer: (valueContainerProps) => (
            <ValueContainer
              allOptions={options}
              summingOption={summingOption}
              {...valueContainerProps}
            />
          ),
        }}
        hideSelectedOptions={false}
        isMulti
        isSearchable={false}
        onChange={onChange}
        styles={defaultStyles}
        value={value}
      />
    );
  }

  return <ReactSelect {...props} styles={defaultStyles} />;
};

const option = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.any,
});

Select.defaultProps = {
  summingOption: undefined,
  isMulti: false,
  options: [],
  defaultValue: undefined,
};

Select.propTypes = {
  summingOption: option,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(option),
  defaultValue: PropTypes.oneOfType([option, PropTypes.arrayOf(option)]),
  onChange: PropTypes.func.isRequired,
};

export default Select;
