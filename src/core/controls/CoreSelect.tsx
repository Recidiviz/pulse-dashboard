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
import React, { forwardRef } from "react";
import ReactSelect from "react-select";
import { coreFontColor } from "../CoreConstants.scss";

import "./CoreSelect.scss";

type FilterOption = {
  label: string;
  value: any;
};

type CoreSelectProps = {
  value: FilterOption | FilterOption[];
  defaultValue: FilterOption | FilterOption[];
  options: FilterOption[];
  onChange: (option: FilterOption) => void;
  [key: string]: any;
};

const coreSelectCustomStyles = {
  singleValue: (provided: any) => ({
    ...provided,
    color: coreFontColor,
  }),
};

export const CoreSelect = forwardRef<HTMLInputElement, CoreSelectProps>(
  (props, ref) => (
    <ReactSelect
      // @ts-ignore
      ref={ref}
      className="Core-Seleсt"
      classNamePrefix="Core-Select"
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => (
          <div className="Core-Select__custom-indicator">
            <span className="Core-Select__custom-arrow" />
          </div>
        ),
      }}
      styles={coreSelectCustomStyles}
      {...props}
    />
  )
);

CoreSelect.displayName = "Select";
