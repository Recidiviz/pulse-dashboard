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
import React, { useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { components } from "react-select";

import Select from "./Select";

import { formatSelectOptionValue, getNewOptions } from "./utils";
import { optionPropType } from "../propTypes";

import "./MultiSelect.scss";

const GroupHeading = ({
  children: label,
  selectProps: { options, value },
  onChange,
}) => {
  const groupOptions = options.find((o) => o.label === label).options;

  const isOptionSelected = (option) =>
    value.some((val) => val.value === option.value);

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

  const selectInput = React.Children.toArray(children).find((input) =>
    ["DummyInput", "Input"].includes(input.type.name)
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
      {text}
      {selectInput}
    </components.ValueContainer>
  );
};

const Option = (props) => {
  const { isSelected, children } = props;

  return (
    <components.Option {...props}>
      <label className="checkbox-container">
        {children}
        <input type="checkbox" checked={isSelected} />
        <span className="checkmark" />
      </label>
    </components.Option>
  );
};

const MultiSelect = ({ summingOption = null, options, onChange, ...props }) => {
  const ref = useRef();

  const handleChange = useCallback(
    (selectedOptions) => {
      onChange(getNewOptions(options, summingOption, selectedOptions));
      setTimeout(() => {
        ref.current.select.inputRef.focus();
      }, 0);
    },
    [onChange, options, summingOption]
  );

  const replacedComponents = useMemo(
    () => ({
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
    }),
    [onChange, options, summingOption]
  );

  return (
    <Select
      ref={ref}
      isSearchable={false}
      closeMenuOnSelect={false}
      components={replacedComponents}
      hideSelectedOptions={false}
      onChange={handleChange}
      options={options}
      {...props}
      isMulti
    />
  );
};

MultiSelect.defaultProps = {
  summingOption: null,
};

MultiSelect.propTypes = {
  defaultValue: PropTypes.arrayOf(optionPropType).isRequired,
  value: PropTypes.arrayOf(optionPropType).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
  summingOption: optionPropType,
};

export default MultiSelect;
