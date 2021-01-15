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

import RevocationsByRiskLevelStore from "./RevocationsByRiskLevel";
import RevocationsByOfficerStore from "./RevocationsByOfficer";
import RevocationsByGenderStore from "./RevocationsByGender";
import RevocationsByDistrictStore from "./RevocationsByDistrict";
import RevocationsByRaceStore from "./RevocationsByRace";
import RevocationsByViolationStore from "./RevocationsByViolation";

import CaseTableStore from "./CaseTable";

export default class DataStore {
  rootStore;

  filtersStore;

  currentTenantId;

  revocationsOverTimeStore;

  matrixStore;

  revocationsByDistrictStore;

  revocationsByGenderStore;

  revocationsByOfficerStore;

  revocationsByRaceStore;

  revocationsByRiskLevelStore;

  revocationsByViolationStore;

  caseTableStore;

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

    this.revocationsByRiskLevelStore = new RevocationsByRiskLevelStore({
      dataStore: this,
      filtersStore,
    });

    this.revocationsByGenderStore = new RevocationsByGenderStore({
      dataStore: this,
      filtersStore,
    });

    this.revocationsByRaceStore = new RevocationsByRaceStore({
      dataStore: this,
      filtersStore,
    });

    this.revocationsByDistrictStore = new RevocationsByDistrictStore({
      dataStore: this,
      filtersStore,
    });

    this.revocationsByViolationStore = new RevocationsByViolationStore({
      dataStore: this,
      filtersStore,
    });

    this.revocationsByOfficerStore = new RevocationsByOfficerStore({
      dataStore: this,
      filtersStore,
    });

    this.caseTableStore = new CaseTableStore({
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
