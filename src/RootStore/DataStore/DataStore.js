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

import { makeAutoObservable } from "mobx";

import MatrixStore from "./Matrix";
import RevocationsOverTimeStore from "./RevocationsOverTime";

// const fileToMetricType = {
//   revocations_matrix_by_month: "revocationsOverTime",
//   revocations_matrix_filtered_caseload: "caseTable",
//   revocations_matrix_cells: "violationReportMatrix",
//   revocations_matrix_distribution_by_district: "revocationsByDistrict",
//   revocations_matrix_distribution_by_race: "revocationsByRace",
//   revocations_matrix_distribution_by_gender: "revocationsByGender",
//   revocations_matrix_distribution_by_officer: "revocationsByOfficer",
//   revocations_matrix_distribution_by_risk_level: "revocationsByRiskLevel",
//   revocations_matrix_distribution_by_violation: "revocationsByViolation",
// };

export default class DataStore {
  rootStore;

  filtersStore;

  currentTenantId;

  revocationsOverTimeStore;

  matrixStore;

  // revocationsByDistrictStore;

  // revocationsByGenderStore;

  // revocationsByOfficerStore;

  // revocationsByRaceStore;

  // revocationsByRiskLevelStore;

  // revocationsByViolationStore;

  // caseTableStore;

  constructor({ rootStore, filtersStore }) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    this.currentTenantId = this.rootStore.currentTenantId;

    this.revocationsOverTimeStore = new RevocationsOverTimeStore({
      dataStore: this,
      filtersStore,
    });

    this.matrixStore = new MatrixStore({
      dataStore: this,
      filtersStore,
    });
  }

  storeByMetricType(metricType) {
    const storeName = `${metricType}Store`;

    return {
      filteredData: this[storeName].filteredData,
      isError: this[storeName].isError,
      isLoading: this[storeName].isLoading,
    };
  }
}
