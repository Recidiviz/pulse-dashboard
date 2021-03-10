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
import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { components } from "react-select";
import { optionPropType } from "../propTypes";

const GroupHeading = ({
  children: label,
  selectProps: { options, value: previousOptions },
  onChange,
  ...props
}) => {
  const groupOptions = options.find((o) => o.label === label).options;

  const getIsOptionSelected = (option) =>
    previousOptions.some(({ value }) => value === option.value);

  const anyOptionSelected = groupOptions.some(getIsOptionSelected);
  const allOptionsSelected = groupOptions.every(getIsOptionSelected);

  const onClick = () => {
    if (allOptionsSelected) {
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

  const checkboxClassNames = cn("MultiSelect__checkbox__group-heading", {
    "MultiSelect__checkbox__group-heading--all": allOptionsSelected,
    "MultiSelect__checkbox__group-heading--partial":
      anyOptionSelected && !allOptionsSelected,
  });

  return (
    <components.GroupHeading
      className="MultiSelect__group-heading"
      onClick={onClick}
      {...props}
    >
      <label className="MultiSelect__checkbox-container">
        {label}
        <input
          className="MultiSelect__checkbox-input"
          type="checkbox"
          checked={allOptionsSelected}
          onClick={onClick}
          onChange={onClick}
          onKeyDown={onClick}
        />
        <span className={checkboxClassNames} />
      </label>
    </components.GroupHeading>
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
