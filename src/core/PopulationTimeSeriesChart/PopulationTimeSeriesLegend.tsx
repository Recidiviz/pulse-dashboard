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
import "./PopulationTimeSeriesLegend.scss";

type propTypes = {
  items: string[];
};

const PopulationTimeSeriesLegend: React.FC<propTypes> = ({ items }) => {
  return (
    <div className="PopulationTimeseriesLegend">
      {items.map((label) => (
        <div className="PopulationTimeseriesLegend__Item" key={label}>
          <div className={`PopulationTimeseriesLegend__Icon ${label}Legend`}>
            <svg height="2" width="24">
              <line
                x1="0"
                y1="0"
                x2="24"
                y2="0"
                className="PopulationTimeseriesLegend__Line"
              />
            </svg>
          </div>
          <div className="PopulationTimeseriesLegend__Text">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default PopulationTimeSeriesLegend;
