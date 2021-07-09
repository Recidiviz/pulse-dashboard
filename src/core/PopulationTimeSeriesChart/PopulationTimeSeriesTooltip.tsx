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

import "./PopulationTimeSeriesTooltip.scss";

import React from "react";

import { formatDate } from "../../utils/formatStrings";

type PropTypes = {
  d: {
    date: Date;
    value: number;
    lowerBound?: number;
    upperBound?: number;
    parentSummary?: any;
  };
};

const PopulationTimeSeriesTooltip: React.FC<PropTypes> = ({ d }) => {
  const { date, value, lowerBound, upperBound } = d;

  if (d.parentSummary !== undefined) {
    // don't display tooltip for summary block
    return null;
  }

  return (
    <div className="PopulationTimeseriesTooltip">
      <div className="PopulationTimeseriesTooltip__Date">
        {formatDate(date, "MMMM yyyy")}
      </div>
      <div className="PopulationTimeseriesTooltip__Value">
        {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
      {lowerBound && upperBound && (
        <div className="PopulationTimeseriesTooltip__Range">
          ({Math.round(lowerBound)}, {Math.round(upperBound)})
        </div>
      )}
    </div>
  );
};

export default PopulationTimeSeriesTooltip;
