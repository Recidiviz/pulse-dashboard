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

import { matrixViolationTypeToLabel } from "../../../../utils/transforms/labels";

const RevocationMatrixRow = ({
  children,
  violationType,
  isSelected,
  sum,
  onClick,
}) => {
  return (
    <div
      className={cx("RevocationMatrix__row", "violation-row", {
        "is-selected": isSelected,
      })}
    >
      <div className="violation-type-label">
        <button type="button" onClick={onClick}>
          {matrixViolationTypeToLabel[violationType]}
        </button>
      </div>
      {children}
      <span className="violation-sum violation-sum-column">{sum}</span>
    </div>
  );
};

RevocationMatrixRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  violationType: PropTypes.string.isRequired,
  sum: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RevocationMatrixRow;
