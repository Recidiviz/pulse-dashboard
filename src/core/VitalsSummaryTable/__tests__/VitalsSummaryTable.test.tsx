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

import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { ENTITY_TYPES } from "../../models/types";
import { useCoreStore } from "../../CoreStoreProvider";
import VitalsSummaryTable from "../VitalsSummaryTable";
import RootStore from "../../../RootStore";
import CoreStore from "../../CoreStore";
import PageVitalsStore from "../../CoreStore/PageVitalsStore";
import { VitalsMetric } from "../../PageVitals/types";
import TENANTS from "../../../tenants";

jest.mock("../../CoreStoreProvider");
jest.mock("../../models/VitalsMetrics");
jest.mock("../../models/ProjectionsMetrics");
jest.mock("../../../RootStore/TenantStore", () => {
  return jest.fn().mockImplementation(() => ({
    currentTenantId: "US_ND",
  }));
});

let coreStore: CoreStore;
let pageVitalsStore: PageVitalsStore;

describe("VitalsSummaryTable", () => {
  const summaryData = [
    {
      entityId: "OFFICE_A",
      entityName: "Office A",
      entityType: ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION,
      overall: 85,
      overall30Day: 0,
      overall90Day: -2,
      parentEntityId: "STATE_DOC",
      timelyContact: 60,
      timelyDischarge: 63,
      timelyRiskAssessment: 69,
    },
    {
      entityId: "STATE_DOC",
      entityName: "State DOC",
      entityType: ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION,
      overall: 95,
      overall30Day: 0,
      overall90Day: -2,
      parentEntityId: "STATE_DOC",
      timelyContact: 90,
      timelyDischarge: 93,
      timelyRiskAssessment: 99,
    },
  ];

  beforeEach(() => {
    coreStore = new CoreStore(RootStore);
    pageVitalsStore = coreStore.pageVitalsStore;

    pageVitalsStore.setSummaries(summaryData);
    // @ts-ignore
    useCoreStore.mockReturnValue({ pageVitalsStore });
  });

  describe("metrics by tenant", () => {
    describe("when the tenant is US_ND", () => {
      const metrics =
        TENANTS.US_ND.vitalsMetrics?.map((m: VitalsMetric) => m.name) || [];
      metrics.forEach((metric: string) => {
        it(`renders a column with header ${metric}`, () => {
          const { getByText } = render(
            <Router>
              <VitalsSummaryTable />
            </Router>
          );
          expect(getByText(metric));
        });
      });
    });
  });
});
