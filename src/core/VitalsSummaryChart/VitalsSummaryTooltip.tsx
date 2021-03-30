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
import { VitalsTimeSeriesRecord } from "../models/types";
import { formatPercent, formatISODateString } from "../../utils/formatStrings";

type PropTypes = {
  data: VitalsTimeSeriesRecord & { percent: number };
  transformX: boolean;
  transformY: boolean;
};

const VitalsSummaryTooltip: React.FC<PropTypes> = ({
  data,
  transformX,
  transformY,
}) => {
  const { date, percent, weeklyAvg } = data;
  const translateY = transformY ? "-100%" : "0";
  const translateX = transformX ? "-105%" : "8px";
  const transformStyle = {
    transform: `translate(${translateX}, ${translateY})`,
  };
  return (
    <div className="VitalsSummaryTooltip" style={transformStyle}>
      <div className="VitalsSummaryTooltip__Date">
        {formatISODateString(date)}
      </div>
      <div className="VitalsSummaryTooltip__Value">
        {formatPercent(percent)}
      </div>
      <div className="VitalsSummaryTooltip__Average">
        7-day avg: {formatPercent(weeklyAvg)}
      </div>
    </div>
  );
};

export default VitalsSummaryTooltip;
