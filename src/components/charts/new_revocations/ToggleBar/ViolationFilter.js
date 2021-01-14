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
import { observer } from "mobx-react-lite";
import { get } from "mobx";

import FilterField from "./FilterField";
import Chip from "../Chip";
import {
  violationCountLabel,
  matrixViolationTypeToLabel,
  pluralize,
} from "../../../../utils/transforms/labels";
import { useRootStore } from "../../../../StoreProvider";
import {
  VIOLATION_TYPE,
  REPORTED_VIOLATIONS,
} from "../../../../constants/filterTypes";

const ViolationFilter = () => {
  const { filtersStore, filters } = useRootStore();
  const reportedViolations = get(filters, REPORTED_VIOLATIONS);
  const violationType = get(filters, VIOLATION_TYPE);

  const clearViolationFilters = () => {
    filtersStore.setFilters({
      [VIOLATION_TYPE]: "",
      [REPORTED_VIOLATIONS]: "",
    });
  };

  const formattedMatrixFilters = useMemo(() => {
    const parts = [];

    if (violationType) {
      parts.push(matrixViolationTypeToLabel[violationType]);
    }
    if (reportedViolations) {
      parts.push(
        pluralize(violationCountLabel(reportedViolations), "violation")
      );
    }
    return parts.join(", ");
  }, [reportedViolations, violationType]);

  if (!formattedMatrixFilters) return null;

  return (
    <div className="ViolationFilter top-level-filters pre-top-level-filters">
      <FilterField
        label="Additional filters"
        className="FilterField--additional"
      >
        <Chip
          label={formattedMatrixFilters}
          onDelete={clearViolationFilters}
          isShrinkable
        />
      </FilterField>
    </div>
  );
};

export default observer(ViolationFilter);
