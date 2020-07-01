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
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactSelect, { components } from "react-select";

import "./Select.scss";

const ValueContainer = (props) => {
  const { selectProps, getValue, children } = props;
  const values = getValue();

  const selectInput = React.Children.toArray(children).find(
    (input) => input.type.name === "Input" || input.type.name === "DummyInput"
  );

  const isAll =
    !selectProps.inputValue && values.length === 1 && values[0].value === "all";

  const text = isAll
    ? "ALL"
    : `${values.length} ${values.length > 2 ? "Items" : "Item"} selected`;

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
};

const Select = ({ allOption, isMulti, ...props }) => {
  const [value, setValue] = useState([allOption]);

  const updateSelectedOptions = (selectedOptions) => {
    props.onChange(selectedOptions);
    setValue(selectedOptions);
  };

  if (isMulti) {
    return (
      <ReactSelect
        {...props}
        hideSelectedOptions={false}
        components={{
          Option,
          ValueContainer,
          // MultiValueRemove: () => null,
        }}
        closeMenuOnSelect={false}
        isMulti
        onChange={(selected) => {
          const options = selected || [];
          const isEmpty = options.length === 0;

          const isAllOptionTheFirst =
            !isEmpty && options[0].value === allOption.value;

          const isAllOptionTheLast =
            !isEmpty && options[options.length - 1].value === allOption.value;

          if (isEmpty || isAllOptionTheLast) {
            updateSelectedOptions([allOption]);
          } else if (isAllOptionTheFirst) {
            updateSelectedOptions(
              options.slice(1).map((s) => ({ ...s, key: s.label }))
            );
          } else {
            updateSelectedOptions(options.map((s) => ({ ...s, key: s.label })));
          }
        }}
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
  allOption: { label: "All", value: "all" },
  isMulti: false,
  options: [],
  defaultValue: undefined,
};

Select.propTypes = {
  allOption: option,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(option),
  defaultValue: PropTypes.oneOfType([option, PropTypes.arrayOf(option)]),
  onChange: PropTypes.func.isRequired,
};

export default Select;
