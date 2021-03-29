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
};

const VitalsSummaryTooltip: React.FC<PropTypes> = ({ data }) => {
  const { date, percent, weeklyAvg } = data;

  return (
    <div className="VitalsSummaryTooltip">
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
