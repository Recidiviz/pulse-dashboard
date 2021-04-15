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
import RevocationsChartStore from "../DataStore/RevocationsChartStore";
import LanternStore from "..";
import { reactImmediately } from "../../../testUtils";

let revocationsChartStore;

const mockFilteredData = [
  { level_2_supervision_location: "03", level_1_supervision_location: "ABC" },
  { level_2_supervision_location: "04", level_1_supervision_location: "CBA" },
];
jest.mock("@sentry/react");
jest.mock("..");
jest.mock("shared-filters", () => {
  return {
    ...jest.requireActual("shared-filters"),
    filterOptimizedDataFormat: jest.fn(() => mockFilteredData),
  };
});

const mockLanternStore = {
  districtsStore: {
    districtIdToLabel: {
      "03": "Philadelphia",
      "04": "Mississippi",
      CBA: "CBA",
      ABC: "ABC",
    },
    districtKeys: {
      filterKey: "levelTwoSupervisionLocation",
      filterByKey: "level_2_supervision_location",
    },
  },
  filters: new Map([["levelTwoSupervisionLocation", ["03"]]]),
};
describe("RevocationsChartStore", () => {
  beforeEach(() => {
    LanternStore.mockImplementation(() => mockLanternStore);
    reactImmediately(() => {
      revocationsChartStore = new RevocationsChartStore({
        rootStore: new LanternStore(),
      });
      revocationsChartStore.apiData = { data: mockFilteredData };
    });
  });

  describe("transformedData", () => {
    it("transforms the district attribute to use district label", () => {
      expect(revocationsChartStore.districtChartData).toEqual([
        {
          district: "Philadelphia",
          level_2_supervision_location: "03",
          level_1_supervision_location: "ABC",
        },
        {
          district: "Mississippi",
          level_2_supervision_location: "04",
          level_1_supervision_location: "CBA",
        },
      ]);
    });
  });

  describe("currentDistricts", () => {
    it("returns an array of the district names currently selected in the filters", () => {
      expect(revocationsChartStore.currentDistricts).toEqual(["Philadelphia"]);
    });
  });
});
