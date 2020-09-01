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

import FilterField from "./FilterField";
import Select from "../../../controls/Select";
import { CUSTODIAL_AUTHORITIES } from "./options";

const CustodialAuthorityFilter = ({ onChange }) => {
  return (
    <FilterField label="Custodial Authority">
      <Select
        className="select-align"
        options={CUSTODIAL_AUTHORITIES}
        onChange={(option) => onChange({ custodialAuthority: option.value })}
        defaultValue={CUSTODIAL_AUTHORITIES[0]}
      />
    </FilterField>
  );
};

CustodialAuthorityFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CustodialAuthorityFilter;
