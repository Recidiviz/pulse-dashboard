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
import { get } from "mobx";

import { useRootStore } from "../../../../StoreProvider";
import {
  VIOLATION_TYPE,
  REPORTED_VIOLATIONS,
} from "../../../../constants/filterTypes";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const minRadius = 25;
const maxRadius = 50;

const MatrixCell = ({
  count,
  maxCount,
  violationType,
  reportedViolations,
  onClick,
}) => {
  const { filters } = useRootStore();
  const ratio = maxCount > 0 ? count / maxCount : 0;
  const radius = Math.max(minRadius, Math.ceil(ratio * maxRadius) + 20);

  const containerStyle = {
    position: "relative",
    zIndex: 1,
    background: "white",
    display: "inline-block",
    width: radius,
    height: radius,
    lineHeight: `${radius}px`,
  };

  const cellStyle = {
    // lantern-dark-blue with opacity
    background:
      ratio === 0 ? COLORS.white : `rgba(0, 44, 66, ${Math.max(ratio, 0.05)})`,
    width: "100%",
    height: "100%",
    borderRadius: Math.ceil(radius / 2),
    color: ratio >= 0.5 ? COLORS.white : COLORS["lantern-dark-blue"],
    fontSize: 15,
  };

  const isCellSelected =
    (get(filters, VIOLATION_TYPE) === "All" ||
      get(filters, VIOLATION_TYPE) === violationType) &&
    (get(filters, REPORTED_VIOLATIONS) === "All" ||
      get(filters, REPORTED_VIOLATIONS) === reportedViolations);

  return (
    <div className="Matrix__cell">
      <div style={containerStyle}>
        <button
          type="button"
          className={cx("Matrix__total-revocations", {
            "is-selected": isCellSelected,
          })}
          onClick={onClick}
          style={cellStyle}
        >
          {count}
        </button>
      </div>
    </div>
  );
};

MatrixCell.propTypes = {
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  violationType: PropTypes.string.isRequired,
  reportedViolations: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MatrixCell;
