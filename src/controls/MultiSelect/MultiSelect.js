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
import "./MultiSelect.scss";

import cn from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactSelect from "react-select";

import { optionPropType } from "../propTypes";
import { getNewOptions } from "../utils";
import GroupHeading from "./GroupHeading";
import Option from "./Option";
import ValueContainer from "./ValueContainer";

const MultiSelect = ({
  summingOption,
  options,
  value,
  onChange,
  className,
  ...props
}) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && ref.current.state.menuIsOpen) {
      ref.current.select.focus();
    }
  }, [value]);

  const handleChange = useCallback(
    (selectedOptions) => {
      if (summingOption) {
        const newOptions = getNewOptions(
          options,
          summingOption,
          selectedOptions
        );
        onChange(newOptions);
        return;
      }
      onChange(selectedOptions);
    },
    [onChange, options, summingOption]
  );
  const replacedComponents = useMemo(
    () => ({
      GroupHeading: (groupHeadingProps) => (
        <GroupHeading onChange={handleChange} {...groupHeadingProps} />
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
    [handleChange, options, summingOption]
  );

  const CustomStyles = {
    groupHeading: (base) => ({
      ...base,
      paddingLeft: "0px",
      fontSize: "inherit",
    }),
    group: (base) => ({ ...base, marginLeft: "0px", paddingLeft: "12px" }),
    option: (base) => ({
      ...base,
      backgroundColor: "transparent",
      color: "inherit",
    }),
  };

  return (
    <ReactSelect
      classNamePrefix="MultiSelect"
      className={cn("MultiSelect", className, {
        "MultiSelect--summing-option-selected": summingOption === value[0],
      })}
      ref={ref}
      closeMenuOnSelect={false}
      components={replacedComponents}
      hideSelectedOptions={false}
      onChange={handleChange}
      options={options}
      styles={CustomStyles}
      onFocus={() => ref.current.setState({ menuIsOpen: true })}
      value={value}
      isSearchable
      isMulti
      {...props}
    />
  );
};

MultiSelect.defaultProps = {
  className: "",
  defaultValue: null,
  summingOption: null,
};
MultiSelect.propTypes = {
  defaultValue: PropTypes.arrayOf(optionPropType),
  value: PropTypes.arrayOf(optionPropType).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
  className: PropTypes.string,
  summingOption: optionPropType,
};

export default MultiSelect;
