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
import { get } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

import { CoreSelect } from "./controls/CoreSelect";
import Filter from "./controls/Filter";
import FilterBar from "./controls/FilterBar";
import { useCoreStore } from "./CoreStoreProvider";
import DetailsGroup from "./DetailsGroup";
import DownloadDataButton from "./DownloadDataButton";
import MethodologyLink from "./MethodologyLink";
import { PopulationFilters } from "./types/filters";
import { getFilterOption } from "./utils/filterOptions";
import { CORE_PATHS, CORE_VIEWS } from "./views";

const PopulationFilterBar: React.FC<{
  view: keyof typeof CORE_VIEWS;
  filterOptions: PopulationFilters;
}> = ({ filterOptions, view }) => {
  const { filtersStore, pageProjectionsStore } = useCoreStore();
  const { filters } = filtersStore;
  const { downloadData } = pageProjectionsStore;
  const filterTypes = Object.keys(filterOptions) as Array<
    keyof PopulationFilters
  >;
  const handleDownload = async () => downloadData();

  return (
    <FilterBar
      details={
        <DetailsGroup>
          <DownloadDataButton handleOnClick={handleDownload} />
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
