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

import cx from "classnames";
import { get } from "mobx";
import PropTypes from "prop-types";
import React from "react";

import { matrixViolationTypeToLabel } from "../../utils/formatStrings";
import { useLanternStore } from "../LanternStoreProvider";
import { REPORTED_VIOLATIONS, VIOLATION_TYPE } from "../utils/constants";

const MatrixRow = ({ children, violationType, sum, onClick }) => {
  const { filters } = useLanternStore();

  const isRowSelected =
    get(filters, VIOLATION_TYPE) === violationType &&
    get(filters, REPORTED_VIOLATIONS) === "All";

  return (
    <div
      className={cx("Matrix__row", {
        "Matrix__row--is-selected": isRowSelected,
      })}
    >
      <div className="Matrix__violation-type-label">
        <button
          className="Matrix__violation-type-button"
          type="button"
          onClick={onClick}
        >
          {matrixViolationTypeToLabel[violationType]}
        </button>
      </div>
      {children}
      <span
        className={cx("Matrix__violation-sum", "Matrix__violation-sum-column")}
      >
        {sum}
      </span>
    </div>
  );
};

MatrixRow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  violationType: PropTypes.string.isRequired,
  sum: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MatrixRow;
