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
import RootStore from "../../../RootStore";
import LanternStore from "..";

let rootStore;

jest.mock("../../../api/metrics/metricsClient");

describe("DataStore", () => {
  beforeEach(() => {
    rootStore = new LanternStore(RootStore);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("contains a RevocationsOverTimeStore", () => {
    expect(rootStore.dataStore.revocationsOverTimeStore).toBeDefined();
  });

  it("contains a MatrixStore", () => {
    expect(rootStore.dataStore.matrixStore).toBeDefined();
  });

  it("contains a RevocationsChartsStore", () => {
    expect(rootStore.dataStore.revocationsChartStore).toBeDefined();
  });

  it("contains a CaseTableStore", () => {
    expect(rootStore.dataStore.caseTableStore).toBeDefined();
  });
});
