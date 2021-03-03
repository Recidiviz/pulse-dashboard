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
import { matchesTopLevelFilters } from "shared-filters";
import BaseDataStore from "./BaseDataStore";
import {
  REPORTED_VIOLATIONS,
  VIOLATION_TYPE,
} from "../../lantern/utils/constants";

export default class MatrixStore extends BaseDataStore {
  constructor({ rootStore }) {
    super({
      rootStore,
      file: `revocations_matrix_cells`,
      ignoredSubsetDimensions: [VIOLATION_TYPE, REPORTED_VIOLATIONS],
    });
  }

  get filteredData() {
    const dataFilter = matchesTopLevelFilters({ filters: this.filters });
    return this.filterData(this.apiData, dataFilter);
  }
}
