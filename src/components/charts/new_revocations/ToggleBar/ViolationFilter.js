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

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import FilterField from "./FilterField";
import Chip from "../Chip";
import useTopBarShrinking from "../../../../hooks/useTopBarShrinking";
import {
  violationCountLabel,
  matrixViolationTypeToLabel,
} from "../../../../utils/transforms/labels";

const ViolationFilter = ({ reportedViolations, violationType, onClick }) => {
  const isTopBarShrinking = useTopBarShrinking();
  const formattedMatrixFilters = useMemo(() => {
    const parts = [];
    if (violationType) {
      parts.push(matrixViolationTypeToLabel[violationType]);
    }
    if (reportedViolations) {
      parts.push(`${violationCountLabel(reportedViolations)} violations`);
    }
    return parts.join(", ");
  }, [reportedViolations, violationType]);

  if (!formattedMatrixFilters) return null;

  return (
    <div className="top-level-filters pre-top-level-filters">
      <FilterField label="Additional filters">
        <Chip
          label={formattedMatrixFilters}
          isShrinking={isTopBarShrinking}
          onDelete={() => {
            onClick({ violationType: "", reportedViolations: "" });
          }}
        />
      </FilterField>
    </div>
  );
};

ViolationFilter.defaultProps = {
  onClick: () => {},
  reportedViolations: "",
  violationType: "",
};

ViolationFilter.propTypes = {
  onClick: PropTypes.func,
  reportedViolations: PropTypes.string,
  violationType: PropTypes.string,
};

export default ViolationFilter;
