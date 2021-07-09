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
/* eslint-disable jsx-a11y/label-has-associated-control */
import "./RadioGroup.scss";

import PropTypes from "prop-types";
import React, { useState } from "react";

const RadioGroup = ({ defaultValue, onChange, options }) => {
  const [state, setState] = useState(defaultValue);

  return (
    <div className="RadioGroup">
      {options.map(({ value, label }) => (
        <label className="RadioGroup__label" key={value}>
          <input
            className="RadioGroup__input"
            type="radio"
            checked={state === value}
            onChange={() => {
              setState(value);
              onChange(value);
            }}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

RadioGroup.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
};

export default RadioGroup;
