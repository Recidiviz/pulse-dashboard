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
import "./PopulationTimeSeriesErrorBar.scss";

import React from "react";

type PropTypes = {
  value: number;
  lowerBound: number;
  upperBound: number;
  screenX: number;
  screenY: number;
  chartTop: number;
};

const CROSS_BAR_WIDTH = 8;

const PopulationTimeSeriesErrorBar: React.FC<PropTypes> = ({
  value,
  lowerBound,
  upperBound,
  screenX,
  screenY,
  chartTop,
}) => {
  const scale = screenY / (chartTop - value);
  const yTop = screenY - (upperBound - value) * scale;
  const yBottom = screenY - (lowerBound - value) * scale;

  return (
    <g className="PopulationTimeSeriesErrorBar">
      <circle cx={screenX} cy={screenY} r={3.5} />
      <line x1={screenX} y1={yTop} x2={screenX} y2={yBottom} />
      <line
        x1={screenX - CROSS_BAR_WIDTH / 2}
        y1={yTop}
        x2={screenX + CROSS_BAR_WIDTH / 2}
        y2={yTop}
      />
      <line
        x1={screenX - CROSS_BAR_WIDTH / 2}
        y1={yBottom}
        x2={screenX + CROSS_BAR_WIDTH / 2}
        y2={yBottom}
      />
    </g>
  );
};

export default PopulationTimeSeriesErrorBar;
