// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import "./TogglePill.scss";

import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";

const TogglePill = ({ currentValue, onChange, leftPill, rightPill }) => {
  return (
    <div className="TogglePill">
      {[leftPill, rightPill].map(({ value, label }) => (
        <button
          type="button"
          key={label}
          className={cx("TogglePill__button", {
            "TogglePill__button--selected": currentValue === value,
          })}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

TogglePill.propTypes = {
  currentValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  leftPill: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  rightPill: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default TogglePill;
