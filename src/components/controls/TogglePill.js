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

/**
 * Returns an artificial Auth0 id token for a fake/demo user.
 * You can uncomment code for testing different user metadata.
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./TogglePill.scss";

export const TogglePill = ({ defaultValue, onChange, options }) => {
  const [state, setState] = useState(defaultValue);

  return (
    <div className="TogglePill">
      {options.map(({ value, label }) => (
        <>
          <input
            className="TogglePill__input"
            type="radio"
            id={label + value}
            name="togglePill"
            checked={state === value}
            onChange={() => {
              setState(value);
              onChange(value);
            }}
          />
          <label
            className="TogglePill__label"
            htmlFor={label + value}
            key={label}
          >
            {label}
          </label>
        </>
      ))}
    </div>
  );
};

TogglePill.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
};
