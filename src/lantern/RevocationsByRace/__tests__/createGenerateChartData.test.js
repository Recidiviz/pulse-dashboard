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

import { setTranslateLocale } from "../../../utils/i18nSettings";
import * as lanternTenant from "../../../RootStore/TenantStore/lanternTenants";
import createGenerateChartData, {
  generateDatasets,
  CHART_COLORS,
} from "../createGenerateChartData";

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
      const result = generateDatasets(
        dataPoints,
        denominators,
        CHART_COLORS
      ).map((d) => {
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
          label: "Other",
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});

describe("createGenerateChartData", () => {
  it("correctly sums the numerators and denominators when there are more than one supervision_location", () => {
    const filteredData = [
      {
        admission_type: "ALL",
        level_2_supervision_location: "03",
        revocation_count: "1",
        revocation_count_all: "100",
        race: "BLACK",
        supervision_population_count: "200",
        supervision_count_all: "202",
        recommended_for_revocation_count: "1",
        recommended_for_revocation_count_all: "10",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "3",
        revocation_count_all: "103",
        race: "BLACK",
        supervision_population_count: "300",
        supervision_count_all: "505",
        recommended_for_revocation_count: "3",
        recommended_for_revocation_count_all: "30",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "03",
        revocation_count: "1",
        revocation_count_all: "100",
        race: "WHITE",
        supervision_population_count: "200",
        supervision_count_all: "202",
        recommended_for_revocation_count: "2",
        recommended_for_revocation_count_all: "20",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "4",
        revocation_count_all: "104",
        race: "WHITE",
        supervision_population_count: "400",
        supervision_count_all: "404",
        recommended_for_revocation_count: "4",
        recommended_for_revocation_count_all: "40",
      },
    ];
    const statePopulationData = [
      {
        race_or_ethnicity: "BLACK",
        population_count: "30000",
        total_state_population_count: "3000000",
      },
      {
        race_or_ethnicity: "WHITE",
        population_count: "40000",
        total_state_population_count: "4000000",
      },
    ];
    const expected = {
      data: ["2.45", "99.01", "1.00"],
      denominators: [204, 606, 4000000],
      numerators: [5, 600, 40000],
    };
    const chartData = createGenerateChartData({
      filteredData,
      statePopulationData,
    })("WHITE");
    expect(chartData.data.datasets[0].data).toEqual(expected.data);
    expect(chartData.numerators).toEqual(expected.numerators);
    expect(chartData.denominators).toEqual(expected.denominators);
  });

  it("does not sum the denominator when there are more than one admission_type", () => {
    const filteredData = [
      {
        admission_type: "SCI_6",
        level_2_supervision_location: "03",
        revocation_count: "1",
        revocation_count_all: "100",
        race: "WHITE",
        supervision_population_count: "200",
        supervision_count_all: "220",
        recommended_for_revocation_count: "0",
        recommended_for_revocation_count_all: "0",
      },
      {
        admission_type: "SCI_6",
        level_2_supervision_location: "04",
        revocation_count: "4",
        revocation_count_all: "104",
        race: "WHITE",
        supervision_population_count: "400",
        supervision_count_all: "440",
        recommended_for_revocation_count: "0",
        recommended_for_revocation_count_all: "0",
      },
      {
        admission_type: "SCI_12",
        level_2_supervision_location: "03",
        revocation_count: "2",
        revocation_count_all: "101",
        race: "WHITE",
        supervision_population_count: "200",
        supervision_count_all: "220",
        recommended_for_revocation_count: "0",
        recommended_for_revocation_count_all: "0",
      },
      {
        admission_type: "SCI_12",
        level_2_supervision_location: "04",
        revocation_count: "6",
        revocation_count_all: "106",
        race: "WHITE",
        supervision_population_count: "400",
        supervision_count_all: "4440",
        recommended_for_revocation_count: "0",
        recommended_for_revocation_count_all: "0",
      },
    ];
    const statePopulationData = [
      {
        race_or_ethnicity: "BLACK",
        population_count: "30000",
        total_state_population_count: "3000000",
      },
      {
        race_or_ethnicity: "WHITE",
        population_count: "40000",
        total_state_population_count: "4000000",
      },
    ];
    const expected = {
      data: ["3.16", "90.91", "1.00"],
      denominators: [411, 660, 4000000],
      numerators: [13, 600, 40000],
    };
    const chartData = createGenerateChartData({
      filteredData,
      statePopulationData,
    })("WHITE");
    expect(chartData.data.datasets[0].data).toEqual(expected.data);
    expect(chartData.numerators).toEqual(expected.numerators);
    expect(chartData.denominators).toEqual(expected.denominators);
  });
});
