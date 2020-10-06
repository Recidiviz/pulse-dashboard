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

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import map from "lodash/fp/map";

import FilterField from "./FilterField";
import MultiSelect from "../../../controls/MultiSelect";
import { optionPropType } from "../../../propTypes";

const AdmissionTypeFilter = ({
  defaultValue,
  value,
  summingOption,
  onChange,
  options = [],
}) => {
  const onValueChange = useCallback(
    (selected) => onChange(map("value", selected)),
    [onChange]
  );

  const selectValue = options.filter((option) => value.includes(option.value));

  return (
    <FilterField label="Admission Type">
      <MultiSelect
        value={selectValue}
        className="select-align"
        options={options}
        onChange={onValueChange}
        summingOption={summingOption}
        defaultValue={defaultValue}
      />
    </FilterField>
  );
};

AdmissionTypeFilter.defaultProps = {
  options: [],
};

AdmissionTypeFilter.propTypes = {
  defaultValue: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(optionPropType).isRequired,
  summingOption: optionPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionPropType),
};

export default AdmissionTypeFilter;
