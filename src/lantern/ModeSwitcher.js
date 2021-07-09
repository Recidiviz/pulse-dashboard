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

import PropTypes from "prop-types";
import React from "react";

import { genderValueToLabel, raceValueToLabel } from "../utils/formatStrings";
import Chip from "./Chip";

const ModeSwitcher = ({ mode, setMode, buttons }) => (
  <div className="ModeSwitcher pB-20">
    {buttons.map(({ label, value }) => (
      <Chip
        key={value}
        label={label}
        isSelected={value === mode}
        onClick={() => setMode(value)}
      />
    ))}
  </div>
);

ModeSwitcher.propTypes = {
  mode: PropTypes.oneOf(
    ["counts", "rates", "exits"].concat(
      Object.keys(raceValueToLabel),
      Object.keys(genderValueToLabel)
    )
  ).isRequired,
  setMode: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ModeSwitcher;
