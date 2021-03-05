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
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import ReactSelect from "react-select";
import { Scrollbars } from "react-custom-scrollbars";

import GroupHeading from "./GroupHeading";
import ValueContainer from "./ValueContainer";
import Option from "./Option";

import { getNewOptions } from "../utils";
import { optionPropType } from "../../propTypes";

import "./CoreMultiSelect.scss";

const CustomScrollBarWrapper = ({ children }) => {
  return (
    <Scrollbars
      thumbSize={31}
      style={{ height: 250, marginBottom: -15, width: 249 }}
    >
      {children}
    </Scrollbars>
  );
};

const CoreMultiSelect = ({
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

  useEffect(() => {
    const input = document.querySelector(".CoreMultiSelect__input > input");
    if (input) {
      input.setAttribute("readonly", "");
    }
  });

  const handleChange = useCallback(
    (selectedOptions) => {
      const newOptions = getNewOptions(options, summingOption, selectedOptions);
      onChange(newOptions);
    },
    [onChange, options, summingOption]
  );

  const replacedComponents = useMemo(
    () => ({
      IndicatorSeparator: () => null,
      GroupHeading: (groupHeadingProps) => (
        <GroupHeading onChange={handleChange} {...groupHeadingProps} />
      ),
      Option,
      MenuList: CustomScrollBarWrapper,
      DropdownIndicator: () => (
        <div className="CoreMultiSelect__custom-indicator">
          <span className="CoreMultiSelect__custom-arrow" />
        </div>
      ),
      ValueContainer: (valueContainerProps) => (
        <ValueContainer
          isCore
          allOptions={options}
          summingOption={summingOption}
          {...valueContainerProps}
        />
      ),
    }),
    [handleChange, options, summingOption]
  );

  return (
    <ReactSelect
      classNamePrefix="CoreMultiSelect"
      className={cn("CoreMultiSelect", className, {
        "CoreMultiSelect--summing-option-selected": summingOption === value[0],
      })}
      ref={ref}
      closeMenuOnSelect={false}
      components={replacedComponents}
      hideSelectedOptions={false}
      onChange={handleChange}
      options={options}
      onFocus={() => ref.current.setState({ menuIsOpen: true })}
      value={value}
      isSearchable
      isMulti
      {...props}
    />
  );
};

CoreMultiSelect.defaultProps = {
  className: "",
};
CoreMultiSelect.propTypes = {
  defaultValue: PropTypes.arrayOf(optionPropType).isRequired,
  value: PropTypes.arrayOf(optionPropType).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
  className: PropTypes.string,
  summingOption: optionPropType.isRequired,
};
CustomScrollBarWrapper.propTypes = {
  children: PropTypes.arrayOf(optionPropType).isRequired,
};

export default CoreMultiSelect;
