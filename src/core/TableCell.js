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

export const TableCell = ({ value }) => (
  <span
    key={value}
    className={cx("StatewideViewTable__bubble", {
      "StatewideViewTable__bubble--70": value < 70,
      "StatewideViewTable__bubble--80": value > 70 && value < 80,
      "StatewideViewTable__bubble--90": value > 80 && value < 90,
      "StatewideViewTable__bubble--100": value > 90,
    })}
  >
    {value}%
  </span>
);

TableCell.propTypes = {
  value: PropTypes.number.isRequired,
};
