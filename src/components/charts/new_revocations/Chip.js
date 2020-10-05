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
import cx from "classnames";

import "./Chip.scss";

const Chip = ({
  label,
  onClick = () => {},
  onDelete = null,
  isSelected = false,
  isShrinking = false,
}) => (
  <div
    className={cx("Chip", {
      Chip_selected: isSelected,
      Chip_shrinking: isShrinking,
    })}
  >
    <button type="button" className="Chip__label" onClick={onClick}>
      {label}
    </button>
    {onDelete && (
      <button type="button" className="Chip__delete-button" onClick={onDelete}>
        <i className="ti-close fw-900" />
      </button>
    )}
  </div>
);

Chip.defaultProps = {
  onClick: () => {},
  onDelete: null,
  isSelected: false,
  isShrinking: false,
};

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  isSelected: PropTypes.bool,
  isShrinking: PropTypes.bool,
};

export default Chip;
