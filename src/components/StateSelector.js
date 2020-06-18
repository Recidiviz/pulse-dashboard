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
import Select from "react-select";
import { useHistory } from "react-router-dom";

import { useStateCode } from "../contexts/StateCodeContext";
import { getStateNameForCode } from "../utils/authentication/user";

const StateSelector = ({ availableStateCodes }) => {
  const { currentStateCode, updateCurrentStateCode } = useStateCode();
  const { push } = useHistory();

  const availableStatesOptions = availableStateCodes.map((code) => ({
    value: code,
    label: getStateNameForCode(code),
  }));

  const defaultValue = availableStatesOptions.find(
    (availableState) => availableState.value === currentStateCode
  );

  const selectState = (selectedOption) => {
    updateCurrentStateCode(selectedOption.value);
    push({ pathname: "/profile" });
  };

  return (
    <Select
      defaultValue={defaultValue}
      onChange={selectState}
      options={availableStatesOptions}
      isSearchable
    />
  );
};

StateSelector.defaultProps = {
  availableStateCodes: [],
};

StateSelector.propTypes = {
  availableStateCodes: PropTypes.arrayOf(PropTypes.string),
};

export default StateSelector;
