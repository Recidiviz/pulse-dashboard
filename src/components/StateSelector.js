// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useState } from 'react';
import Select from 'react-select';

import { getStateNameForCode } from '../utils/authentication/user';
import {
  getAvailableStates,
  getCurrentStateForRecidivizUsers,
  setCurrentStateForRecidivizUsers,
} from '../views/stateViews';

const StateSelector = () => {
  const availableStateCodes = getAvailableStates();
  const availableStates = availableStateCodes.map(
    (code) => ({ value: code, label: getStateNameForCode(code) }),
  );

  const [selectedState, setSelectedState] = useState(
    {
      value: getCurrentStateForRecidivizUsers(),
      label: getStateNameForCode(getCurrentStateForRecidivizUsers()),
    },
  );

  const selectState = (selectedOption) => {
    const stateCode = selectedOption.value.toLowerCase();
    setCurrentStateForRecidivizUsers(stateCode);
    setSelectedState({ value: stateCode, label: getStateNameForCode(stateCode) });
    // Refresh the entire page
    window.location.reload(false);
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

export default StateSelector;
