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
import DistrictFilterDropown from "./DistrictFilterDropown";
import { useLanternStore } from "../LanternStoreProvider";
import { flatOptions } from "../../controls/utils";
import { allOption } from "../LanternStore/FiltersStore";

const DistrictFilter = () => {
  const {
    filters,
    filtersStore,
    restrictedDistricts,
    userRestrictedAccessStore,
    districtsStore,
  } = useLanternStore();
  const {
    isLoading: userRestrictedAccessIsLoading,
  } = userRestrictedAccessStore;
  const {
    isLoading: districtsIsLoading,
    districtKeys: { filterKey, secondaryFilterKey },
  } = districtsStore;
  const { filterOptions } = filtersStore;
  const isLoading = userRestrictedAccessIsLoading || districtsIsLoading;

  const { options } = filterOptions[filterKey];

  const onValueChange = (newOptions) => {
    const optionValues = map("value", newOptions);

    filtersStore.setFilters({
      [filterKey]: optionValues,
      ...(secondaryFilterKey
        ? { [secondaryFilterKey]: map("secondaryValue", newOptions) }
        : {}),
    });
  };

  const selectedValues = flatOptions(options).filter((option) =>
    get(filters, filterKey).includes(option.value)
  );

  const singleValueOption =
    restrictedDistricts.length === 1 ? restrictedDistricts[0] : undefined;

  const hasRestrictedValues = restrictedDistricts.length > 1;

  return (
    <FilterField label="District">
      <DistrictFilterDropown
        singleValueOption={singleValueOption}
        hasRestrictedValues={hasRestrictedValues}
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
