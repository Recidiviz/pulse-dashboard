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
import { runInAction } from "mobx";

import RootStore from "../../../RootStore";
import ProjectionsMetrics from "../../models/ProjectionsMetrics";
import VitalsMetrics from "../../models/VitalsMetrics";
import CoreStore from "..";

let coreStore: CoreStore;

jest.mock("../../../RootStore/UserStore", () => {
  return jest.fn().mockImplementation(() => ({
    user: {},
  }));
});

jest.mock("../../models/VitalsMetrics");
jest.mock("../../models/ProjectionsMetrics");
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

  describe("when the tenantId changes", () => {
    it("fetches new vitals metrics for the new tenantId", () => {
      runInAction(() => {
        coreStore.tenantStore.currentTenantId = "US_ID";
        expect(coreStore.metricsStore.vitals).toBeInstanceOf(VitalsMetrics);
        expect(VitalsMetrics).toHaveBeenCalledWith({
          tenantId: "US_ID",
          sourceEndpoint: "vitals",
        });
      });
    });

    it("fetches new projections metrics for the new tenantId", () => {
      runInAction(() => {
        coreStore.tenantStore.currentTenantId = "US_ID";
        expect(coreStore.metricsStore.projections).toBeInstanceOf(
          ProjectionsMetrics
        );
        expect(ProjectionsMetrics).toHaveBeenCalledWith({
          tenantId: "US_ID",
          sourceEndpoint: "projections",
          rootStore: coreStore,
        });
      });
    });
  });
});
