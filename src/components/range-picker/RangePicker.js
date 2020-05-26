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

import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";

import { defaultStaticRanges, formatRange } from "./helpers";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./rangePicker.scss";

const RangePicker = () => {
  const [[range], setRanges] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="dropdown">
      <button
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true"
        className="range-picker-input"
      >
        {formatRange(range)}
      </button>
      <div className="dropdown-menu">
        <DateRangePicker
          onChange={(item) => setRanges([item.selection])}
          showSelectionPreview={false}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={[range]}
          direction="horizontal"
          staticRanges={defaultStaticRanges}
          inputRanges={[]}
        />
      </div>
    </div>
  );
};

export default RangePicker;
