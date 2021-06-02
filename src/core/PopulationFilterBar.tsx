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
import { useFiltersStore } from "./CoreStoreProvider";
import { getFilterOption } from "./utils/filterOptions";
import { PopulationFilters } from "./types/filters";

import Filter from "./controls/Filter";
import FilterBar from "./controls/FilterBar";
import { CORE_PATHS, CORE_VIEWS } from "./views";
import DownloadDataButton from "./DownloadDataButton";
import MethodologyLink from "./MethodologyLink";
import DetailsGroup from "./DetailsGroup";

const PopulationFilterBar: React.FC<{
  view: keyof typeof CORE_VIEWS;
  filterOptions: PopulationFilters;
}> = ({ filterOptions, view }) => {
  const filtersStore = useFiltersStore();
  const { filters } = filtersStore;
  const filterTypes = Object.keys(filterOptions) as Array<
    keyof PopulationFilters
  >;

  return (
    <FilterBar
      details={
        <DetailsGroup>
          <DownloadDataButton
            data={[]}
            title="Population Projections"
            // @ts-ignore
            methodology="hi"
            filters=""
            // @ts-ignore
            lastUpdatedOn="1/10/2021"
          />
          <MethodologyLink path={CORE_PATHS.methodologyProjections} />
        </DetailsGroup>
      }
    >
      {filterTypes.map((filterType) => {
        const filter = filterOptions[filterType];
        if (!filter.enabledViews.includes(view)) return null;
        return (
          <Filter
            key={`${view}-${filterType}`}
            title={filter.title}
            width={filter.width}
          >
            <CoreSelect
              value={getFilterOption(get(filters, filter.type), filter.options)}
              options={filter.options}
              onChange={filter.setFilters(filtersStore)}
              defaultValue={filter.defaultValue}
            />
          </Filter>
        );
      })}
    </FilterBar>
  );
};

export default observer(PopulationFilterBar);
