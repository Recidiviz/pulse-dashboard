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
import PropTypes from "prop-types";

import filter from "lodash/fp/filter";
import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";

import FilterField from "./FilterField";
import Select from "../../../controls/Select";
import useChartData from "../../../../hooks/useChartData";
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  getUserDistricts,
  getUserAppMetadata,
} from "../../../../utils/authentication/user";
import MultiSelect from "../../../controls/MultiSelect";

const allDistrictsOption = { label: "All", value: "All" };

const DistrictFilter = ({ value, stateCode, onChange }) => {
  const { user } = useAuth0();
  const { isLoading, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_cells"
  );

  const { district, region } = getUserAppMetadata(user);
  const userDistricts = getUserDistricts(user);

  const select = useMemo(() => {
    if (district) {
      const singleValue = { label: userDistricts[0], value: userDistricts[0] };

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

    const { options, summingOption, defaultValue } = region
      ? {
          options: [allDistrictsOption].concat(
            map((d) => ({ label: d, value: d }), userDistricts)
          ),
          summingOption: allDistrictsOption,
          defaultValue: [allDistrictsOption],
        }
      : {
          options: [allDistrictsOption].concat(
            pipe(
              map("district"),
              filter((d) => d.toLowerCase() !== "all"),
              uniq,
              sortBy(identity),
              map((d) => ({ value: d, label: d }))
            )(apiData)
          ),
          summingOption: allDistrictsOption,
          defaultValue: [allDistrictsOption],
        };

    const onValueChange = (newOptions) => onChange(map("value", newOptions));

    const selectValue = options.filter((option) =>
      value.includes(option.value)
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
  }, [district, userDistricts, region, isLoading, apiData, onChange, value]);

  return <FilterField label="District">{select}</FilterField>;
};

DistrictFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateCode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DistrictFilter;
