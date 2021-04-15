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
import { matchesAllFilters } from "shared-filters";
import BaseDataStore from "./BaseDataStore";
import { US_PA } from "../../../RootStore/TenantStore/lanternTenants";

export default class CaseTableStore extends BaseDataStore {
  constructor({ rootStore }) {
    super({
      rootStore,
      file: `revocations_matrix_filtered_caseload`,
      treatCategoryAllAsAbsent: true,
    });
  }

  get filteredData() {
    const dataFilter = matchesAllFilters({
      filters: this.filters,
      treatCategoryAllAsAbsent: this.treatCategoryAllAsAbsent,
    });
    return this.filterData(this.apiData, dataFilter);
  }

  get options() {
    return this.rootStore.currentTenantId === US_PA
      ? [
          { key: "state_id", label: "DOC ID" },
          { key: "district", label: "District" },
          { key: "officer", label: "Agent" },
          { key: "risk_level", label: "Risk level" },
          { key: "violation_record", label: "Violation record" },
        ]
      : [
          { key: "state_id", label: "DOC ID" },
          { key: "district", label: "District" },
          { key: "officer", label: "Officer" },
          { key: "risk_level", label: "Risk level" },
          {
            key: "officer_recommendation",
            label: "Last Rec. (Incl. Supplementals)",
          },
          { key: "violation_record", label: "Violation record" },
        ];
  }
}
