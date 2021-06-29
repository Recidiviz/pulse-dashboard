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
import PageProjectionsStore from "../PageProjectionsStore";
import RootStore from "../../../RootStore";
import CoreStore from "..";

jest.mock("../../models/ProjectionsMetrics", () => {
  return jest.fn().mockImplementation(() => ({
    getFilteredDataByView: () => [
      {
        year: 2021,
        month: 1,
        compartment: "SUPERVISION",
        legalStatus: "PAROLE",
        gender: "MALE",
        totalPopulation: 1000,
        totalPopulationMax: 1200,
        totalPopulationMin: 900,
      },
      {
        year: 2021,
        month: 2,
        compartment: "SUPERVISION",
        legalStatus: "PAROLE",
        gender: "MALE",
        totalPopulation: 2000,
        totalPopulationMax: 2100,
        totalPopulationMin: 1900,
      },
      {
        year: 2021,
        month: 3,
        compartment: "SUPERVISION",
        legalStatus: "PAROLE",
        gender: "MALE",
        totalPopulation: 1000,
        totalPopulationMax: 1200,
        totalPopulationMin: 900,
      },
    ],
  }));
});
jest.mock("../../models/VitalsMetrics");
jest.mock("../../../RootStore/TenantStore", () => {
  return jest.fn().mockImplementation(() => ({
    currentTenantId: "US_ID",
  }));
});

let coreStore: CoreStore;
let pageProjectionsStore: PageProjectionsStore;

describe("PageProjectionsStore", () => {
  beforeEach(() => {
    coreStore = new CoreStore(RootStore);
    pageProjectionsStore = coreStore.pageProjectionsStore;
  });

  describe("timeSeriesDownloadableData", () => {
    it("returns the data formatted for download", () => {
      const expected = {
        chartDatasets: [
          {
            data: [
              {
                "CI Lower": 900,
                "CI Upper": 1200,
                Population: 1000,
              },
              {
                "CI Lower": 1900,
                "CI Upper": 2100,
                Population: 2000,
              },
              {
                "CI Lower": 900,
                "CI Upper": 1200,
                Population: 1000,
              },
            ],
            label: "",
          },
        ],
        chartLabels: ["Jan '21", "Feb '21", "Mar '21"],
        chartId: "Population Projection",
        dataExportLabel: "Month",
      };
      const result = pageProjectionsStore.timeSeriesDownloadableData;
      expect(result).toEqual(expected);
    });
  });

  describe("filtersText", () => {
    it("formats the filters description for the csv file", () => {
      coreStore.setView("/community/projections");
      expect(pageProjectionsStore.filtersText).toEqual(
        "Supervision - 6 months; Gender: All; Supervision Type: All,,,"
      );
    });

    it("formats the filters text according to the view", () => {
      coreStore.setView("/facilities/projections");
      expect(pageProjectionsStore.filtersText).toEqual(
        "Incarceration - 6 months; Gender: All; Legal Status: All,,,"
      );
    });
  });
});
