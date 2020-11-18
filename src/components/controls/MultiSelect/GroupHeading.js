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
      <label className="MultiSelect__checkbox-container">
        {label}
        <input
          className="MultiSelect__checkbox-input"
          type="checkbox"
          checked={isAllOptionsSelected}
          onClick={onClick}
          onKeyPress={onClick}
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
