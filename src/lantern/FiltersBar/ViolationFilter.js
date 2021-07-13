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

import { get } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { isAllItem } from "shared-filters";

import {
  matrixViolationTypeToLabel,
  pluralize,
  violationCountLabel,
} from "../../utils/formatStrings";
import Chip from "../Chip";
import { useLanternStore } from "../LanternStoreProvider";
import { REPORTED_VIOLATIONS, VIOLATION_TYPE } from "../utils/constants";
import FilterField from "./FilterField";

const ViolationFilter = () => {
  const { filtersStore, filters } = useLanternStore();
  const { filterOptions } = filtersStore;
  const reportedViolations = get(filters, REPORTED_VIOLATIONS);
  const violationType = get(filters, VIOLATION_TYPE);

  const clearViolationFilters = () => {
    filtersStore.setFilters({
      [VIOLATION_TYPE]: filterOptions[VIOLATION_TYPE].defaultValue,
      [REPORTED_VIOLATIONS]: filterOptions[REPORTED_VIOLATIONS].defaultValue,
    });
  };

  const formattedMatrixFilters = useMemo(() => {
    const parts = [];
    if (violationType && !isAllItem(violationType)) {
      parts.push(matrixViolationTypeToLabel[violationType]);
    }
    if (reportedViolations && !isAllItem(reportedViolations)) {
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
          isSmall
        />
      </FilterField>
    </div>
  );
};

export default observer(ViolationFilter);
