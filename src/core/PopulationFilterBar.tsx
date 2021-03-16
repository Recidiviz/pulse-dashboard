// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { CoreSelect } from "./controls/CoreSelect";
import { usePopulationFiltersStore } from "../components/StoreProvider";
import { FilterOption, getFilterValue } from "./utils/filterOptions";
import { FILTER_TYPES } from "./utils/constants";
import Filter from "./controls/Filter";
import FilterBar from "./controls/FilterBar";

const PopulationFilterBar: React.FC = () => {
  const filtersStore = usePopulationFiltersStore();
  const { filters, filterOptions } = filtersStore;

  const setFilters = (filterKey: string) => (option: FilterOption) => {
    filtersStore.setFilters({ [filterKey]: option.value });
  };

  const timePeriod = filterOptions[FILTER_TYPES.TIME_PERIOD];
  const gender = filterOptions[FILTER_TYPES.GENDER];
  const legalStatus = filterOptions[FILTER_TYPES.LEGAL_STATUS];

  return (
    <FilterBar>
      <Filter title="Time Period" width="8rem">
        <CoreSelect
          value={getFilterValue(
            get(filters, FILTER_TYPES.TIME_PERIOD),
            timePeriod.options
          )}
          options={timePeriod.options}
          onChange={setFilters(FILTER_TYPES.TIME_PERIOD)}
          defaultValue={timePeriod.defaultValue}
        />
      </Filter>

      <Filter title="Gender" width="7rem">
        <CoreSelect
          value={getFilterValue(
            get(filters, FILTER_TYPES.GENDER),
            gender.options
          )}
          options={gender.options}
          onChange={setFilters(FILTER_TYPES.GENDER)}
          defaultValue={gender.defaultValue}
        />
      </Filter>

      <Filter title="Legal Status" width="8.5rem">
        <CoreSelect
          value={getFilterValue(
            get(filters, FILTER_TYPES.LEGAL_STATUS),
            legalStatus.options
          )}
          options={legalStatus.options}
          onChange={setFilters(FILTER_TYPES.LEGAL_STATUS)}
          defaultValue={legalStatus.defaultValue}
        />
      </Filter>
    </FilterBar>
  );
};

export default observer(PopulationFilterBar);
