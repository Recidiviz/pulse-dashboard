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
import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { get } from "mobx";

import filter from "lodash/fp/filter";
import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";

import FilterField from "./FilterField";
import Select from "../../../controls/Select";
import useChartData from "../../../../hooks/useChartData";
import MultiSelect from "../../../controls/MultiSelect";
import { useRootStore } from "../../../../StoreProvider";
import { DISTRICT } from "../../../../constants/filterTypes";

const allDistrictsOption = { label: "All", value: "All" };

const DistrictFilter = () => {
  const { filters, filtersStore, currentTenantId, userStore } = useRootStore();
  const { isLoading, apiData } = useChartData(
    `${currentTenantId}/newRevocations`,
    "revocations_matrix_cells"
  );

  const { district } = userStore;

  const select = useMemo(() => {
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
    const options = [allDistrictsOption].concat(
      pipe(
        map("district"),
        filter((d) => d.toLowerCase() !== "all"),
        uniq,
        sortBy(identity),
        map((d) => ({ value: d, label: d }))
      )(apiData)
    );
    const summingOption = allDistrictsOption;
    const defaultValue = [allDistrictsOption];

    const onValueChange = (newOptions) => {
      const districts = map("value", newOptions);
      filtersStore.setFilters({ [DISTRICT]: districts });
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
  }, [district, isLoading, apiData, filtersStore, filters]);

  return <FilterField label="District">{select}</FilterField>;
};

export default observer(DistrictFilter);
