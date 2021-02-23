// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { setTranslateLocale } from "../../../../../utils/i18nSettings";
import * as lanternTenant from "../../../../../RootStore/TenantStore/lanternTenants";
import { generateDatasets } from "../createGenerateChartData";

describe("generateDatasets", () => {
  let denominators;
  let dataPoints;

  beforeAll(() => {
    denominators = [
      [10, 9, 8, 7, 6, 5],
      [10, 9, 8, 7, 6, 5],
      [10, 9, 8, 7, 6, 5],
      [10, 9, 8, 7, 6, 5],
      [10, 9, 8, 7, 6, 5],
    ];
    dataPoints = [
      ["100", "90", "80", "70", "60", "50"],
      ["90", "80", "70", "60", "50", "40"],
      ["80", "70", "60", "50", "40", "30"],
      ["70", "60", "50", "40", "30", "20"],
      ["60", "50", "40", "30", "20", "10"],
    ];
  });

  describe("when the locale is US_MO", () => {
    beforeEach(() => {
      setTranslateLocale(lanternTenant.US_MO);
    });

    it("generates the dataset data and label correctly", () => {
      const result = generateDatasets(dataPoints, denominators).map((d) => {
        const { data, label } = d;
        return { data, label };
      });

      const expected = [
        {
          data: ["100", "90", "80", "70", "60", "50"],
          label: "Caucasian",
        },
        {
          data: ["90", "80", "70", "60", "50", "40"],
          label: "African American",
        },
        {
          data: ["80", "70", "60", "50", "40", "30"],
          label: "Hispanic",
        },
        {
          data: ["70", "60", "50", "40", "30", "20"],
          label: "Asian",
        },
        {
          data: ["60", "50", "40", "30", "20", "10"],
          label: "Native American",
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe("when the locale is US_PA", () => {
    beforeEach(() => {
      setTranslateLocale(lanternTenant.US_PA);
    });

    it("generates the dataset data and label correctly", () => {
      const result = generateDatasets(dataPoints, denominators).map((d) => {
        const { data, label } = d;
        return { data, label };
      });

      const expected = [
        {
          data: ["100", "90", "80", "70", "60", "50"],
          label: "White",
        },
        {
          data: ["90", "80", "70", "60", "50", "40"],
          label: "Black",
        },
        {
          data: ["80", "70", "60", "50", "40", "30"],
          label: "Hispanic",
        },
        {
          data: ["70", "60", "50", "40", "30", "20"],
          label: "Asian",
        },
        {
          data: ["60", "50", "40", "30", "20", "10"],
          label: "Native American",
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
