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

import Select from "../../../controls/Select";
import FilterField from "./FilterField";
import { PAFilterOptions } from "../../../../views/tenants/constants/filterOptions";

const SupervisionLevelFilter = ({ onChange }) => (
  <FilterField label="Supervision Level">
    <Select
      className="select-align"
      options={PAFilterOptions.supervisionLevel.options}
      onChange={(option) => {
        onChange({ supervisionLevel: option.value });
      }}
      defaultValue={PAFilterOptions.supervisionLevel.defaultOption}
    />
  </FilterField>
);

SupervisionLevelFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SupervisionLevelFilter;
