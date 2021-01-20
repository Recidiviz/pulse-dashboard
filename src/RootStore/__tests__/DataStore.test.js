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
import DataStore from "../DataStore";
import RootStore from "../RootStore";
import { useAuth0 } from "../../react-auth0-spa";
import { METADATA_NAMESPACE } from "../../utils/authentication/user";

let rootStore;
let dataStore;

jest.mock("../../react-auth0-spa");
jest.mock("../../api/metrics/metricsClient");

const metadataField = `${METADATA_NAMESPACE}app_metadata`;
const mockUser = { [metadataField]: { state_code: "US_MO" } };

describe("DataStore", () => {
  useAuth0.mockReturnValue({ user: mockUser, getTokenSilently: () => {} });

  beforeEach(() => {
    rootStore = new RootStore();
    dataStore = new DataStore({ rootStore });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("contains a RevocationsOverTimeStore", () => {
    expect(dataStore.revocationsOverTimeStore).toBeDefined();
  });

  it("contains a MatrixStore", () => {
    expect(dataStore.matrixStore).toBeDefined();
  });

  it("contains a RevocationsChartsStore", () => {
    expect(dataStore.revocationsChartStore).toBeDefined();
  });

  it("contains a CaseTableStore", () => {
    expect(dataStore.caseTableStore).toBeDefined();
  });
});
