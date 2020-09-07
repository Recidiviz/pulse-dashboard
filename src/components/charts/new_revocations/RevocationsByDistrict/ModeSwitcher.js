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

import Chip from "../Chip";

const buttons = [
  { label: "Revocation count", value: "counts" },
  { label: "Percent revoked of standing population", value: "rates" },
  { label: "Percent revoked of exits", value: "exits" },
];

// TODO: delete jquery if component is being used
const ModeSwitcher = ({ mode, setMode }) => (
  <div
    id="modeButtons"
    className="pB-20 btn-group btn-group-toggle"
    data-toggle="buttons"
  >
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
  mode: PropTypes.oneOf(["counts", "rates", "exits"]).isRequired,
  setMode: PropTypes.func.isRequired,
};

export default ModeSwitcher;
