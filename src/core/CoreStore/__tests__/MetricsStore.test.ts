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
import CoreStore from "..";
import VitalsMetrics from "../../models/VitalsMetrics";
import ProjectionsMetrics from "../../models/ProjectionsMetrics";

let coreStore: CoreStore;

jest.mock("../../../RootStore/UserStore", () => {
  return jest.fn().mockImplementation(() => ({
    user: {},
  }));
});

jest.mock("../../../RootStore/TenantStore", () => {
  return jest.fn().mockImplementation(() => ({
    currentTenantId: "US_ND",
  }));
});

describe("MetricsStore", () => {
  beforeEach(() => {
    coreStore = new CoreStore(RootStore);
  });

  describe("metrics", () => {
    it("has a reference to the vitals metrics", () => {
      expect(coreStore.metricsStore.vitals).toBeInstanceOf(VitalsMetrics);
    });

    it("has a reference to the projections metrics", () => {
      expect(coreStore.metricsStore.projections).toBeInstanceOf(
        ProjectionsMetrics
      );
    });
  });
});
