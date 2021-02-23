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
import map from "lodash/fp/map";
import { observer } from "mobx-react-lite";
import { get } from "mobx";

import FilterField from "./FilterField";
import MultiSelect from "../../../controls/MultiSelect";
import { flatOptions } from "../../../controls/utils";
import { useRootStore } from "../../../../StoreProvider";
import { ADMISSION_TYPE } from "../../../../constants/filterTypes";

const AdmissionTypeFilter = () => {
  const { filtersStore } = useRootStore();
  const { filters, filterOptions } = filtersStore;
  const value = get(filters, ADMISSION_TYPE);
  const { options, defaultOption, summingOption } = filterOptions[
    ADMISSION_TYPE
  ];

  const onValueChange = (selected) => {
    filtersStore.setFilters({ [ADMISSION_TYPE]: map("value", selected) });
  };

  const selectValue = flatOptions(options).filter((option) =>
    value.includes(option.value)
  );

  return (
    <FilterField label="Admission Type">
      <MultiSelect
        value={selectValue}
        options={options}
        onChange={onValueChange}
        summingOption={summingOption}
        defaultValue={defaultOption}
      />
    </FilterField>
  );
};

export default observer(AdmissionTypeFilter);
