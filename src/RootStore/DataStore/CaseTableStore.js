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
import BaseDataStore from "./BaseDataStore";
import { matchesAllFilters } from "../../components/charts/new_revocations/helpers";
import { filterOptimizedDataFormat } from "../../utils/charts/dataFilters";

export default class CaseTableStore extends BaseDataStore {
  constructor({ rootStore }) {
    super({ rootStore, file: `revocations_matrix_filtered_caseload` });
  }

  filterData({ data, metadata }) {
    const { filters } = this.rootStore;
    const dataFilter = matchesAllFilters({
      filters,
      treatCategoryAllAsAbsent: true,
    });
    return filterOptimizedDataFormat({
      apiData: data,
      metadata,
      filterFn: dataFilter,
    });
  }
}
