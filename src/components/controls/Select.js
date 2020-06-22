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

import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";

const fontStyles = {
  color: "rgba(114, 119, 122, 0.8)",
  textTransform: "uppercase",
};

const defaultStyles = {
  option: (base) => ({ ...base, ...fontStyles }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  valueContainer: (base) => ({ ...base, maxWidth: 800 }),
};

const Select = ({ allOption, isMulti, ...props }) => {
  const [value, setValue] = useState(isMulti ? [allOption] : allOption);

  const updateSelectedOptions = (selectedOptions) => {
    props.onChange(selectedOptions);
    setValue(selectedOptions);
  };

  if (isMulti) {
    if (value.length === 1 && value[0].value === allOption.value) {
      return (
        <ReactSelect
          {...props}
          onChange={(selected) => {
            updateSelectedOptions([selected]);
          }}
          styles={defaultStyles}
          value={value[0]}
        />
      );
    }

    return (
      <ReactSelect
        {...props}
        isMulti
        onChange={(selected) => {
          const options = selected || [];
          const isEmpty = options.length === 0;

          const isAllOptionTheLast =
            !isEmpty && options[options.length - 1].value === allOption.value;

          if (isEmpty || isAllOptionTheLast) {
            updateSelectedOptions([allOption]);
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
