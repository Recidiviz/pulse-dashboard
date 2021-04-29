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
import Select from "../../controls/Select";
import MultiSelect from "../../controls/MultiSelect";

const DistrictFilterDropdown = ({
  restrictedValues,
  selected,
  options,
  isLoading,
  onValueChange,
  defaultValue,
}) => {
  if (restrictedValues.length === 1) {
    const singleValue = {
      label: restrictedValues[0],
      value: restrictedValues[0],
    };

    return (
      <Select
        className="DistrictFilterDropdown"
        value={singleValue}
        options={[singleValue]}
        defaultValue={singleValue}
        onChange={() => {}}
        isDisabled
      />
    );
  }

  const defaultValueProps =
    restrictedValues.length > 1
      ? {}
      : {
          summingOption: defaultValue,
          defaultValue: [defaultValue],
        };

  return (
    <MultiSelect
      className="DistrictFilterDropdown"
      options={options}
      value={selected}
      onChange={onValueChange}
      isMulti
      isLoading={isLoading}
      isSearchable
      {...defaultValueProps}
    />
  );
};

const SelectOption = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  allSelectedLabel: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      secondaryValue: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

DistrictFilterDropdown.defaultProps = {
  defaultValue: null,
};

DistrictFilterDropdown.propTypes = {
  restrictedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape(SelectOption)).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape(SelectOption)).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape(SelectOption),
};

export default DistrictFilterDropdown;
