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
import PercentDelta from "../controls/PercentDelta";
import { VitalsSummaryRecord } from "../models/types";

import "./VitalsWeeklyChange.scss";

type PropTypes = {
  data: VitalsSummaryRecord;
};

type WeeklyChangeProps = {
  numDays: number;
  value: number;
};

const WeeklyChange: React.FC<WeeklyChangeProps> = ({ numDays, value }) => {
  return (
    <div className="VitalsWeeklyChange__container">
      <div className="VitalsWeeklyChange__title">{`${numDays}-day change`}</div>
      <div className="VitalsWeeklyChange__value">
        <PercentDelta
          className="VitalsWeeklyChange__delta"
          value={value}
          width={22}
          height={18}
          improvesOnIncrease
        />
      </div>
    </div>
  );
};

const VitalsWeeklyChange: React.FC<PropTypes> = ({ data }) => {
  // todo - calculate 7day and 28day values from timeseries data
  return (
    <div className="VitalsWeeklyChange">
      <WeeklyChange numDays={7} value={data.overall7Day} />
      <WeeklyChange numDays={28} value={data.overall28Day} />
    </div>
  );
};
export default VitalsWeeklyChange;
