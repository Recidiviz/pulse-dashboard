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

import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { useHistory } from "react-router-dom";

import { getStateNameForCode } from "../utils/authentication/user";
import {
  getAvailableStateCodesForAdminUser,
  setCurrentStateCodeForAdminUsers,
} from "../views/stateViews";
import { useAdminStateCode } from "../contexts/AdminStateCodeContext";

const StateSelector = ({ user }) => {
  const { push } = useHistory();
  const { adminStateCode, setAdminStateCode } = useAdminStateCode();

  const availableStateCodes = getAvailableStateCodesForAdminUser(user);
  const availableStates = availableStateCodes.map((code) => ({
    value: code,
    label: getStateNameForCode(code),
  }));

  const initialState = availableStates.find(
    (availableState) => availableState.value === adminStateCode
  );
  const [selectedState, setSelectedState] = useState(initialState);

  const selectState = (selectedOption) => {
    const stateCode = selectedOption.value.toLowerCase();
    setCurrentStateCodeForAdminUsers(stateCode);
    setAdminStateCode(stateCode);
    setSelectedState({
      value: stateCode,
      label: getStateNameForCode(stateCode),
    });

    push({ pathname: "/" });
  };

  return (
    <Select
      value={selectedState}
      onChange={selectState}
      options={availableStates}
      isSearchable
    />
  );
};

StateSelector.defaultProps = {
  user: undefined,
};

StateSelector.propTypes = {
  user: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    [PropTypes.string]: PropTypes.shape({
      state_code: PropTypes.string,
    }),
  }),
};

export default StateSelector;
