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
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { formatPercent } from "../utils";

const DeltaTableCell: React.FC<{ value: number }> = ({ value }) => {
  const deltaDirectionClassName = cx({
    "VitalsSummaryTable__arrow--decreasing": value < 0,
    "VitalsSummaryTable__arrow--increasing": value > 0,
    "VitalsSummaryTable__arrow--hidden": value === 0,
  });
  return (
    <div className="VitalsSummaryTable__change">
      <div className={deltaDirectionClassName} />
      {formatPercent(value)}
    </div>
  );
};

DeltaTableCell.propTypes = {
  value: PropTypes.number.isRequired,
};

export default DeltaTableCell;
