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
import SelectDropdown from "./SelectDropdown";
import { useRootStore } from "../../../../StoreProvider";
import { DISTRICT } from "../../../../constants/filterTypes";

const allOption = { label: "All", value: "All" };

const SupervisionLocationFilter = () => {
  const {
    filters,
    filtersStore,
    userStore,
    supervisionLocationsStore,
  } = useRootStore();
  const { restrictedDistrict } = userStore;
  const { supervisionLocations, isLoading } = supervisionLocationsStore;

  const options = [allOption].concat(
    supervisionLocations.map((d) => ({ value: d, label: d }))
  );

  const onValueChange = (newOptions) => {
    const filteredDistricts = map("value", newOptions);
    filtersStore.setFilters({ [DISTRICT]: filteredDistricts });
  };

  const selectedValues = options.filter((option) =>
    get(filters, DISTRICT).includes(option.value)
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

export default observer(SupervisionLocationFilter);
