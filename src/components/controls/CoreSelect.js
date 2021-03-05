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
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";

import { optionPropType } from "../propTypes";
import "./CoreSelect.scss";

export const CoreSelect = forwardRef((props, ref) => (
  <ReactSelect
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
    {...props}
  />
));

CoreSelect.propTypes = {
  value: PropTypes.oneOfType([
    optionPropType,
    PropTypes.arrayOf(optionPropType),
  ]).isRequired,
  defaultValue: PropTypes.oneOfType([
    optionPropType,
    PropTypes.arrayOf(optionPropType),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
};

CoreSelect.displayName = "Select";
