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

import { observer } from "mobx-react-lite";
import { get } from "mobx";
import map from "lodash/fp/map";

import FilterField from "./FilterField";
import Select from "../../../controls/Select";
import MultiSelect from "../../../controls/MultiSelect";
import { useRootStore } from "../../../../StoreProvider";

const allOption = { label: "All", value: "All" };

const DistrictFilter = () => {
  const { filters, filtersStore, tenantStore, userStore } = useRootStore();
  const { restrictedDistrict } = userStore;

  const getSelectElement = () => {
    if (restrictedDistrict) {
      const singleValue = {
        label: restrictedDistrict,
        value: restrictedDistrict,
      };

      return (
        <Select
          value={singleValue}
          options={[singleValue]}
          defaultValue={singleValue}
          onChange={() => {}}
          isDisabled
        />
      );
    }
    const { districts, districtsIsLoading } = tenantStore;
    const options = [allDistrictsOption].concat(
      districts.map((d) => ({ value: d, label: d }))
    );
    const summingOption = allDistrictsOption;
    const defaultValue = [allDistrictsOption];

    const onValueChanged = (newOptions) =>
      filtersStore.setFilters({ [DISTRICT]: map("value", newOptions) });

    const onValueChange = (newOptions, action) => {
      const isHaveChildren = options.filter(
        (option) =>
          option.value.includes(action.option.value) &&
          option.value !== action.option.value
      );
      if (action.action === "select-option") {
        if (action.option.value === "All") {
          return onValueChanged(options);
        }

        if (isHaveChildren.length > 1) {
          return onValueChanged(newOptions.concat(isHaveChildren));
        }
      }
      if (action.action === "deselect-option") {
        if (action.option.value === "All") {
          return onValueChanged();
        }
        if (isHaveChildren.length > 1) {
          return onValueChanged(
            newOptions.filter(
              (item) =>
                !isHaveChildren.some(
                  (children) => children.value === item.value
                )
            )
          );
        }
      }
      return onValueChanged(newOptions);
    };

  const selectedValues = options.filter((option) =>
    get(filters, filterKey).includes(option.value)
  );

  return (
    <FilterField label="District">
      <SelectDropdown
        singleValueOption={restrictedDistrict}
        options={options}
        selected={selectedValues}
        onValueChange={onValueChange}
        isLoading={isLoading}
        defaultValue={allOption}
      />
    </FilterField>
  );
};

export default observer(DistrictFilter);
