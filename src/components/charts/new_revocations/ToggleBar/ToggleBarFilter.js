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

import Select from "../../../controls/Select";
import FilterField from "./FilterField";
import { optionPropType } from "../../../propTypes";

const ToggleBarFilter = ({
  label,
  value,
  options,
  defaultOption,
  onChange,
}) => {
  const onValueChange = (option) => onChange(option.value);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <FilterField label={label}>
      <Select
        value={selectedOption}
        options={options}
        onChange={onValueChange}
        defaultValue={defaultOption}
      />
    </FilterField>
  );
};

ToggleBarFilter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
  defaultOption: optionPropType.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ToggleBarFilter;
