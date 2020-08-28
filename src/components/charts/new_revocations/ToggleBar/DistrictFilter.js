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
  getUserMetadata,
} from "../../../../utils/authentication/user";

const DistrictFilter = ({ stateCode, onChange }) => {
  const { user } = useAuth0();
  const { isLoading, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_cells"
  );

  const { district, region } = getUserMetadata(user);
  const userDistricts = getUserDistricts(user);

  if (district) {
    return (
      <FilterField label="District">
        <Select
          className="select-align"
          options={{ label: userDistricts[0], value: userDistricts[0] }}
          defaultValue={{ label: userDistricts[0], value: userDistricts[0] }}
          isDisabled
        />
      </FilterField>
    );
  }

  if (region) {
    const regionDistricts = pipe(
      map((d) => ({ label: d, value: d })),
      (options) => [{ label: "All region districts", value: "All" }, ...options]
    )(userDistricts);

    return (
      <FilterField label="District">
        <Select
          className="select-align"
          options={regionDistricts}
          onChange={(options) => {
            onChange({ district: map("value", options) });
          }}
          isMulti
          isLoading={isLoading}
          summingOption={{ label: "All region districts", value: "All" }}
          defaultValue={[{ label: "All region districts", value: "All" }]}
          isSearchable
        />
      </FilterField>
    );
  }

  const districts = pipe(
    map("district"),
    filter((d) => d.toLowerCase() !== "all"),
    uniq,
    sortBy(identity),
    map((d) => ({ value: d, label: d })),
    (options) => [{ label: "All districts", value: "All" }, ...options]
  )(apiData);

  return (
    <FilterField label="District">
      <Select
        className="select-align"
        options={districts}
        onChange={(options) => {
          onChange({ district: map("value", options) });
        }}
        isMulti
        isLoading={isLoading}
        summingOption={{ label: "All districts", value: "All" }}
        defaultValue={[{ label: "All districts", value: "All" }]}
        isSearchable
      />
    </FilterField>
  );
};

DistrictFilter.propTypes = {
  stateCode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DistrictFilter;
