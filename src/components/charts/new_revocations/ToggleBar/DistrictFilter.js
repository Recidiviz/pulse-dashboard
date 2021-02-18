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
// import Select from "../../../controls/Select";
import MultiSelect from "../../../controls/MultiSelect";
import { useRootStore } from "../../../../StoreProvider";

const allOption = { label: "All", value: "All" };

const DistrictFilter = () => {
  const { filters, filtersStore, tenantStore } = useRootStore();
  // const { restrictedDistrict } = userStore;

  const getSelectElement = () => {
    // if (restrictedDistrict) {
    //   const singleValue = {
    //     label: restrictedDistrict,
    //     value: restrictedDistrict,
    //   };

    //   return (
    //     <Select
    //       value={singleValue}
    //       options={[singleValue]}
    //       defaultValue={singleValue}
    //       onChange={() => {}}
    //       isDisabled
    //     />
    //   );
    // }
    const { districts, districtsIsLoading } = tenantStore;
    const options = [allDistrictsOption].concat(
      districts.map((d) => ({ value: d, label: d }))
    );
    const summingOption = allDistrictsOption;
    const defaultValue = [allDistrictsOption];

    const onValueChange = (newOptions) => {
      if (newOptions.some((item) => item.value === "All")) {
        const filterAllDistricts = map("value", options);
        filtersStore.setFilters({ [DISTRICT]: filterAllDistricts });
      } else if (
        newOptions.some(
          (item) =>
            options.filter((item2) => item2.value.includes(item.value)).length >
            1
        )
      ) {
        const filteredOptions = newOptions
          .map((item) =>
            options.filter((item2) => item2.value.includes(item.value))
          )
          .flat(1);
        const filterEveryDistricts = map("value", filteredOptions);
        filtersStore.setFilters({ [DISTRICT]: filterEveryDistricts });
      } else {
        const filteredDistricts = map("value", newOptions);
        filtersStore.setFilters({ [DISTRICT]: filteredDistricts });
      }
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
