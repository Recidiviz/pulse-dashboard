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

import { COLORS } from "../../../../assets/scripts/constants/colors";

const minRadius = 25;
const maxRadius = 50;

const RevocationMatrixCell = ({ count, maxCount, isSelected, onClick }) => {
  const ratio = maxCount > 0 ? count / maxCount : 0;
  const radius = Math.max(minRadius, Math.ceil(ratio * maxRadius));

  const containerStyle = {
    background: "white",
    display: "inline-block",
    width: radius,
    height: radius,
    lineHeight: `${radius}px`,
  };

  const cellStyle = {
    background: `rgba(0, 44, 66, ${ratio})`, // lantern-dark-blue with opacity
    width: "100%",
    height: "100%",
    borderRadius: Math.ceil(radius / 2),
    color: ratio >= 0.5 ? COLORS.white : COLORS["lantern-dark-blue"],
  };

  return (
    <div className="RevocationMatrix__cell cell">
      <div style={containerStyle}>
        <button
          type="button"
          className={cx("total-revocations", { "is-selected": isSelected })}
          onClick={onClick}
          style={cellStyle}
        >
          {count}
        </button>
      </div>
    </div>
  );
};

RevocationMatrixCell.propTypes = {
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default RevocationMatrixCell;
