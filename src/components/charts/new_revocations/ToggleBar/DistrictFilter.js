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
import { useAuth0 } from "../../../../react-auth0-spa";
import { getUserAppMetadata } from "../../../../utils/authentication/user";
import MultiSelect from "../../../controls/MultiSelect";
import { useRootStore } from "../../../../StoreProvider";
import { DISTRICT } from "../../../../constants/filterTypes";

const allDistrictsOption = { label: "All", value: "All" };

const DistrictFilter = () => {
  const { filters, filtersStore, dataStore } = useRootStore();
  const store = dataStore.revocationsOverTimeStore;
  const { user } = useAuth0();
  const { district } = getUserAppMetadata(user);

  const getSelectElement = () => {
    if (district) {
      const singleValue = { label: district, value: district };

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
    const { districts, isLoading } = store;
    const options = [allDistrictsOption].concat(districts);
    const summingOption = allDistrictsOption;
    const defaultValue = [allDistrictsOption];

    const onValueChange = (newOptions) => {
      const filteredDistricts = map("value", newOptions);
      filtersStore.setFilters({ [DISTRICT]: filteredDistricts });
    };

    const selectValue = options.filter((option) =>
      get(filters, DISTRICT).includes(option.value)
    );

    return (
      <MultiSelect
        options={options}
        summingOption={summingOption}
        defaultValue={defaultValue}
        value={selectValue}
        onChange={onValueChange}
        isMulti
        isLoading={isLoading}
        isSearchable
      />
    );
  };

  return <FilterField label="District">{getSelectElement()}</FilterField>;
};

export default observer(DistrictFilter);
